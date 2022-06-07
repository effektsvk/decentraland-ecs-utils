import { IMaterialComponent } from '../component/imaterialcomponent'

/**
 * @public
 */
export class MaterialSystem implements ISystem {
  public static _instance: MaterialSystem | null = null

  private _components: ComponentConstructor<IMaterialComponent>[] = []
  private _componentGroups: ComponentGroup[] = []

  static createAndAddToEngine(): MaterialSystem {
    if (this._instance == null) {
      this._instance = new MaterialSystem()
      engine.addSystem(this._instance)
    }
    return this._instance
  }

  static registerCustomComponent<T extends IMaterialComponent>(
    component: ComponentConstructor<T>
  ) {
    this.createAndAddToEngine()._components.push(component)
  }

  public addComponentType(
    component: ComponentConstructor<IMaterialComponent>
  ) {
    for (let comp of this._components) {
      if (component == comp) {
        return
      }
    }
    this._components.push(component)
    this._componentGroups.push(engine.getComponentGroup(component, Transform))
  }

  private constructor() {
    MaterialSystem._instance = this
  }

  update(dt: number) {
    for (let i = 0; i < this._components.length; i++) {
      this.updateComponent(dt, this._components[i], this._componentGroups[i])
    }
  }

  private updateComponent<T extends IMaterialComponent>(
    dt: number,
    component: ComponentConstructor<T>,
    group: ComponentGroup
  ) {
    group.entities.forEach(entity => {
      const transform = entity.getComponent(Transform)
      const comp = entity.getComponent(component)

      comp.update(dt)
      comp.assignValueToTransform(transform)
      if (comp.hasFinished()) {
        entity.removeComponent(comp)
        if (comp.onFinishCallback != null) comp.onFinishCallback()
      }
    })
  }
}
