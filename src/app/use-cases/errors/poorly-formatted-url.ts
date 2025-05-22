export class PoorlyFormattedURL extends Error {
  constructor() {
    super('URL mal formatada. Por favor verificar!')
  }
}
