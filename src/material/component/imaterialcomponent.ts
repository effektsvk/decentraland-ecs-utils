/**
 * @public
 */
 export interface IMaterialComponent {
    onFinishCallback?: () => void
    update(dt: number): void
    hasFinished(): boolean
    assignValueToMaterial(material: Material): void
  }
  