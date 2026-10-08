// Stand-in for src/lib/services.ts in the design-system build. The real file talks to Firebase.
// Data is passed in as props by the previews; analytics calls do nothing here.
export function incrementCvDownloadCount() {}
export function trackPortfolioEvent() {}
export function trackProjectEvent() {}
