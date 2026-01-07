"use client"
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { ChevronDown, ChevronUp, Check, Edit2 } from 'lucide-react'

interface ProductCut {
    weight: string
    price: number
    stock: boolean
}

interface ProductOption {
    name: string
    required: boolean
    multiple: boolean
    choices: {
        label: string
        extraPrice: number
    }[]
}

interface ProductCutSelectorProps {
    product: {
        _id: string
        name: string
        price?: number
        cuts?: ProductCut[]
        options?: ProductOption[]
        allowSpecialInstructions?: boolean
        image?: SanityImageSource
        slug: string
    }
}

export default function ProductCutSelector({ product }: ProductCutSelectorProps) {
    const { addToCart } = useCart()
    const [selectedCut, setSelectedCut] = useState<ProductCut | null>(null)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
    const [specialInstructions, setSpecialInstructions] = useState('')
    const [expandedOption, setExpandedOption] = useState<number | null>(null)

    const hasCuts = product.cuts && product.cuts.length > 0
    const hasOptions = product.options && product.options.length > 0
    const availableCuts = product.cuts?.filter(cut => cut.stock) || []

    // Auto-expand first incomplete required option on mount or when selections change
    useEffect(() => {
        if (hasOptions && expandedOption === null) {
            const firstIncomplete = product.options!.findIndex((option, idx) => {
                if (option.required) {
                    const selections = selectedOptions[option.name] || []
                    return selections.length === 0
                }
                return false
            })

            if (firstIncomplete !== -1) {
                setExpandedOption(firstIncomplete)
            }
        }
    }, [hasOptions, product.options, selectedOptions, expandedOption])

    // Validate if all required options are selected
    const validateRequiredOptions = (): boolean => {
        if (!hasOptions) return true

        for (const option of product.options!) {
            if (option.required) {
                const selections = selectedOptions[option.name] || []
                if (selections.length === 0) {
                    return false
                }
            }
        }
        return true
    }

    const isOptionComplete = (optionName: string, required: boolean): boolean => {
        const selections = selectedOptions[optionName] || []
        return selections.length > 0
    }

    const handleOptionChange = (optionName: string, choiceLabel: string, isMultiple: boolean, optionIdx: number) => {
        setSelectedOptions(prev => {
            let updated: Record<string, string[]>
            if (isMultiple) {
                const current = prev[optionName] || []
                const isAdding = !current.includes(choiceLabel)

                // Check sauce limit for wings/boneless
                if (isAdding && (product.name.toLowerCase().includes('alitas') || product.name.toLowerCase().includes('boneless'))) {
                    // Check if this option is likely the sauce option
                    if (optionName.toLowerCase().includes('salsa') || optionName.toLowerCase().includes('sabor')) {
                        if (selectedCut) {
                            const match = selectedCut.weight.match(/\d+/);
                            if (match) {
                                const quantity = parseInt(match[0], 10);
                                const maxSauces = Math.max(1, Math.floor(quantity / 6));

                                if (current.length >= maxSauces) {
                                    alert(`Para ${selectedCut.weight}, solo puedes elegir hasta ${maxSauces} salsa${maxSauces > 1 ? 's' : ''}.`);
                                    return prev;
                                }
                            }
                        }
                    }
                }

                const newSelections = current.includes(choiceLabel)
                    ? current.filter(c => c !== choiceLabel)
                    : [...current, choiceLabel]
                updated = { ...prev, [optionName]: newSelections }
            } else {
                updated = { ...prev, [optionName]: [choiceLabel] }

                // Auto-collapse and open next if single-select required option
                const currentOption = product.options![optionIdx]
                if (currentOption.required && !isMultiple) {
                    setTimeout(() => {
                        setExpandedOption(null)
                        // Find next incomplete required option
                        const nextIncomplete = product.options!.findIndex((opt, idx) => {
                            if (idx <= optionIdx) return false
                            if (opt.required) {
                                const sels = updated[opt.name] || []
                                return sels.length === 0
                            }
                            return false
                        })
                        if (nextIncomplete !== -1) {
                            setTimeout(() => setExpandedOption(nextIncomplete), 100)
                        }
                    }, 300)
                }
            }
            return updated
        })
    }

    const calculateTotalPrice = (): number => {
        let basePrice = 0

        if (hasCuts && selectedCut) {
            basePrice = selectedCut.price
        } else if (product.price) {
            basePrice = product.price
        }

        let extraPrice = 0
        if (hasOptions) {
            product.options!.forEach(option => {
                const selections = selectedOptions[option.name] || []
                selections.forEach(selectedLabel => {
                    const choice = option.choices.find(c => c.label === selectedLabel)
                    if (choice) {
                        extraPrice += choice.extraPrice
                    }
                })
            })
        }

        return basePrice + extraPrice
    }

    const handleAddToCart = () => {
        // Validate cuts if required
        if (hasCuts && !selectedCut) {
            alert('Por favor selecciona una porción')
            return
        }

        // Validate required options
        if (!validateRequiredOptions()) {
            alert('Por favor completa todas las opciones requeridas')
            return
        }

        const totalPrice = calculateTotalPrice()

        addToCart({
            _id: `${product._id}-${selectedCut?.weight || 'default'}`,
            name: product.name,
            price: totalPrice,
            image: product.image,
            slug: product.slug,
            unit: selectedCut?.weight || product.price ? 'porción' : undefined,
            cutWeight: selectedCut?.weight,
            selectedOptions: hasOptions ? selectedOptions : undefined,
            specialInstructions: specialInstructions || undefined
        })

        // Reset after adding
        setSelectedCut(null)
        setSelectedOptions({})
        setSpecialInstructions('')
        setExpandedOption(null)
    }

    // If no cuts and no options, just show simple add to cart
    if (!hasCuts && !hasOptions) {
        return (
            <button
                onClick={() => {
                    addToCart({
                        _id: product._id,
                        name: product.name,
                        price: product.price || 0,
                        image: product.image,
                        slug: product.slug,
                        unit: 'porción'
                    })
                }}
                className="w-full py-4 rounded-lg font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 text-lg uppercase tracking-wide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Agregar al Carrito
            </button>
        )
    }

    return (
        <div className="space-y-4">
            {/* Cut Selector */}
            {hasCuts && availableCuts.length > 0 && (
                <div>
                    <label htmlFor="cut-selector" className="block text-xl font-bold text-white mb-4">
                        Selecciona una Porción {hasCuts && <span className="text-amber-500">*</span>}
                    </label>
                    <select
                        id="cut-selector"
                        value={selectedCut ? `${selectedCut.weight}-${selectedCut.price}` : ''}
                        onChange={(e) => {
                            const [weight, price] = e.target.value.split('-')
                            const cut = product.cuts?.find(c => c.weight === weight && c.price === parseFloat(price))
                            setSelectedCut(cut || null)
                        }}
                        className="w-full bg-black/50 backdrop-blur-xl text-white rounded-lg p-4 border border-white/20 focus:border-amber-500 focus:outline-none text-lg"
                    >
                        <option value="">Selecciona una porción...</option>
                        {availableCuts.map((cut, index) => (
                            <option key={index} value={`${cut.weight}-${cut.price}`}>
                                {cut.weight} - L. {cut.price.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Options Selector - Collapsible Step-by-Step */}
            {hasOptions && product.options!.map((option, idx) => {
                const isExpanded = expandedOption === idx
                const isComplete = isOptionComplete(option.name, option.required)
                const selections = selectedOptions[option.name] || []

                return (
                    <div key={idx} className="backdrop-blur-xl bg-black/30 border border-white/20 rounded-lg overflow-hidden">
                        {/* Header */}
                        <button
                            onClick={() => setExpandedOption(isExpanded ? null : idx)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-white">
                                        {option.name} {option.required && <span className="text-amber-500">*</span>}
                                    </h3>
                                    {isComplete && (
                                        <Check className="text-green-500" size={20} />
                                    )}
                                </div>
                                {!isExpanded && isComplete && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {selections.join(', ')}
                                    </p>
                                )}
                                {/* Show limit hint for sauces */}
                                {(product.name.toLowerCase().includes('alitas') || product.name.toLowerCase().includes('boneless')) &&
                                    (option.name.toLowerCase().includes('salsa') || option.name.toLowerCase().includes('sabor')) &&
                                    selectedCut && (
                                        <p className="text-xs text-amber-500 mt-1">
                                            Máximo {Math.max(1, Math.floor(parseInt(selectedCut.weight.match(/\d+/)?.[0] || '0') / 6))} salsas
                                        </p>
                                    )}
                            </div>
                            <div className="flex items-center gap-2">
                                {!isExpanded && isComplete && (
                                    <Edit2 className="text-amber-500" size={18} />
                                )}
                                {isExpanded ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
                            </div>
                        </button>

                        {/* Choices - Collapsible */}
                        {isExpanded && (
                            <div className="p-4 pt-0 space-y-2 max-h-96 overflow-y-auto">
                                {option.choices.map((choice, choiceIdx) => (
                                    <label
                                        key={choiceIdx}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-black/50 backdrop-blur-xl border border-white/20 hover:border-amber-500 cursor-pointer transition-all"
                                    >
                                        <input
                                            type={option.multiple ? "checkbox" : "radio"}
                                            name={option.name}
                                            checked={selections.includes(choice.label)}
                                            onChange={() => handleOptionChange(option.name, choice.label, option.multiple, idx)}
                                            className="w-5 h-5 accent-amber-500"
                                        />
                                        <span className="flex-1 text-white font-medium">{choice.label}</span>
                                        {choice.extraPrice > 0 && (
                                            <span className="text-amber-500 font-bold">+L. {choice.extraPrice.toFixed(2)}</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}

            {/* Special Instructions */}
            {product.allowSpecialInstructions && (
                <div>
                    <label htmlFor="special-instructions" className="block text-xl font-bold text-white mb-4">
                        Indicaciones Especiales (Opcional)
                    </label>
                    <textarea
                        id="special-instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Ej: Sin cebolla, extra picante, etc."
                        rows={3}
                        className="w-full bg-black/50 backdrop-blur-xl text-white rounded-lg p-4 border border-white/20 focus:border-amber-500 focus:outline-none resize-none"
                    />
                </div>
            )}

            {/* Price Summary */}
            <div className="backdrop-blur-xl bg-black/50 border border-white/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <span className="text-white/70">Precio Total:</span>
                    <span className="text-amber-500 text-3xl font-black">L. {calculateTotalPrice().toFixed(2)}</span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={hasCuts && !selectedCut}
                className={`
                    w-full py-4 rounded-lg font-bold text-black transition-colors flex items-center justify-center gap-2 text-lg uppercase tracking-wide
                    ${(hasCuts && !selectedCut) || !validateRequiredOptions()
                        ? 'bg-gray-700 cursor-not-allowed opacity-50 text-white'
                        : 'bg-amber-500 hover:bg-amber-600'
                    }
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {(hasCuts && !selectedCut) || !validateRequiredOptions() ? 'Completa las opciones' : 'Agregar al Carrito'}
            </button>
        </div>
    )
}
