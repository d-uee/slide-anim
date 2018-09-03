interface InAnimItem {
	el: HTMLElement,
	defaultStyle: string,
	timeoutId: number,
	onCancelled(): any,
}

const pool: InAnimItem[] = [];

export const inAnimItems = {

	add(
		el: HTMLElement,
		defaultStyle: string,
		timeoutId: any, // number
		onCancelled: any
	) {

		const inAnimItem: InAnimItem = { el, defaultStyle, timeoutId, onCancelled }
		this.remove( el );
		pool.push( inAnimItem );

	},

	remove( el: HTMLElement ) {

		const index = inAnimItems.findIndex( el );

		if ( index === - 1 ) return;

		const inAnimItem: InAnimItem = pool[ index ];

		clearTimeout( inAnimItem.timeoutId );
		inAnimItem.onCancelled();
		pool.splice( index, 1 );

	},

	find( el: HTMLElement ): InAnimItem {

		return pool[ inAnimItems.findIndex( el ) ];

	},

	findIndex( el: HTMLElement ): number {

		let index = - 1;

		pool.some( ( item: InAnimItem, i: number ) => {

			if ( item.el === el ) {

				index = i;
				return true;

			}

			return false;

		} );

		return index;

	}

};
