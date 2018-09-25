import { WATCH_COMPONENT } from '../constants';

function getWatchList(depTree) {
	const list = Object.values(depTree);
	const components = [];

	list.forEach((item) => {
		if (typeof item === 'string') {
			components.push(item);
		} else if (Array.isArray(item)) {
			item.forEach((component) => {
				if (typeof component === 'string') {
					components.push(component);
				} else {
					// in this case, we have { <conjunction>: <> } object inside the array
					components.push(...getWatchList(component));
				}
			});
		} else if (typeof item === 'object' && item !== null) {
			components.push(...getWatchList(item));
		}
	});

	return components.filter((value, index, array) => array.indexOf(value) === index);
}

export default function watchManReducer(state = {}, action) {
	if (action.type === WATCH_COMPONENT) {
		const watchList = getWatchList(action.react);
		const newState = { ...state };

		Object.keys(newState).forEach((key) => {
			newState[key] = newState[key].filter(value => value !== action.component);
		});

		watchList.forEach((item) => {
			if (Array.isArray(newState[item])) {
				newState[item] = [...newState[item], action.component];
			} else {
				newState[item] = [action.component];
			}
		});
		return newState;
	}
	return state;
}
