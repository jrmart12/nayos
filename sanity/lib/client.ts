import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    // Pages are statically generated and regenerated on-demand via the Sanity
    // webhook (/api/revalidate). CDN responses can be stale, so a regenerated
    // page could capture an outdated price. Bypassing the CDN guarantees each
    // (now infrequent) build/regeneration reads the true latest data.
    useCdn: false,
})
