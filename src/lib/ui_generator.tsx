import { ReduxComponentBaseClass } from "./base_classes";
import { Reducer, AnyAction, Store } from 'redux'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { logger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension'


export class UiGenerator {
	element_list: ReduxComponentBaseClass[] = []
	reducers: {[reducerName:string]: Reducer} = {}


	add_element(element: any){
		this.element_list = [...this.element_list, element]
	}

	get_reducers(): void{
		for (let element of this.element_list){
			const reducers = element.get_reducers()
			for(let reducerName in reducers){
				if(reducerName in this.reducers && !(element.defaultReducerNames.indexOf(reducerName) > -1)){
					throw `The reducerName '${reducerName}' of the ` + 
								`element with name '${element.name}', is already in reducers.`
				}
				else{
					this.reducers[reducerName] = reducers[reducerName]
				}
			}
		}
	}

	configureStore(preloadedState={}):Store {
		const middlewares = [logger];
		const middlewareEnhancer =applyMiddleware(...middlewares)
		const composeEnhancers = composeWithDevTools({})
	  	const composedEnhancers = composeEnhancers(middlewareEnhancer);
		const store = createStore(
	    combineReducers(this.reducers),
	    preloadedState,
	    composedEnhancers
	    );

		// allows hotswap for reducers
		if (process.env.NODE_ENV !== 'production' && module.hot) {
		  	module.hot.accept('./src', () =>{
			    store.replaceReducer(combineReducers(this.reducers))
				}
		  )
		}
		​
	  return store
	}

	show(){
		this.get_reducers()
		let store = this.configureStore()
		for (let element of this.element_list){
			console.log(element)
			element.setStore(store)
			element.show()
		}
	}

}