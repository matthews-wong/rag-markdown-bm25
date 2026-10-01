# Deployments

## Shipping a release
Merge to main and the pipeline builds, tests and publishes an image tagged with the commit sha.

## Rolling back
Redeploy the previous image tag with the rollback workflow. Database migrations are not reverted automatically.

# Incidents

## Paging
The on-call engineer is paged when the error budget burn rate exceeds the fast-burn threshold.

## Post-mortems
Write a blameless post-mortem within five working days of any customer-facing incident.
