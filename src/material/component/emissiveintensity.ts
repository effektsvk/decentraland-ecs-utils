import { IMaterialComponent } from './imaterialcomponent'
import { MaterialSystem } from '../system/materialSystem'
import { InterpolationType, Interpolate } from '../math/interpolation'

/**
 * Component to change emissive intensity of a material from one value (start) to another (end) in an amount of time
 * @public
 */
@Component('emissiveIntensityComponent')
export class EmissiveIntensityComponent implements IMaterialComponent {
  private start: number
  private end: number
  private speed: number
  private normalizedTime: number
  private interpolationType: InterpolationType
  private lerpTime: number

  onFinishCallback?: () => void

  /**
   * Create a EmissiveIntensityComponent instance to add as a component to a Entity
   * @param start - starting emissive intensity
   * @param end - ending emissive intensity
   * @param duration - duration (in seconds) of start to end scaling
   * @param onFinishCallback - called when scaling ends
   * @param interpolationType - type of interpolation to be used (default: LINEAR)
   */
  constructor(
    start: ReadOnlyVector3,
    end: ReadOnlyVector3,
    duration: number,
    onFinishCallback?: () => void,
    interpolationType: InterpolationType = InterpolationType.LINEAR
  ) {
    this.start = start
    this.end = end
    this.normalizedTime = 0
    this.lerpTime = 0
    this.onFinishCallback = onFinishCallback
    this.interpolationType = interpolationType

    if (duration != 0) {
      this.speed = 1 / duration
    } else {
      this.speed = 0
      this.normalizedTime = 1
      this.lerpTime = 1
    }

    let instance = MaterialSystem.createAndAddToEngine()
    instance.addComponentType(EmissiveIntensityComponent)
  }

  update(dt: number) {
    this.normalizedTime = Scalar.Clamp(
      this.normalizedTime + dt * this.speed,
      0,
      1
    )
    this.lerpTime = Interpolate(this.interpolationType, this.normalizedTime)
  }

  hasFinished(): boolean {
    return this.normalizedTime >= 1
  }

  assignValueToMaterial(material: Material) {
    // TODO: resolve how to set value
    material.emissiveIntensity = Vector3.Lerp(this.start, this.end, this.lerpTime)
  }
}
