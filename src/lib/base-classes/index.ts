import { BaseView } from "./base-views"
import { BaseControl } from "./base-control"
import { BaseTrigger } from "./base-triggers"


export interface MinimalPropRequirement{
	container: string|Element|null
	name: string

}

export interface BaseUiState{
	uiActive: boolean
}

export interface GlobalBaseUiState{
	UiActiveState: BaseUiState
}

export { BaseView, BaseControl, BaseTrigger }