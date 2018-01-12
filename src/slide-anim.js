const inAnimItems = {

	_: [],

	add( el, defaultStyle, timeoutId, onCancelled ) {

		inAnimItems.remove( el );
		inAnimItems._.push( { el, defaultStyle, timeoutId, onCancelled } );

	},

	remove( el ) {

		const index = inAnimItems.findIndex( el );

		if ( index === - 1 ) return;

		const inAnimItem = inAnimItems._[ index ];

		clearTimeout( inAnimItem.timeoutId );
		inAnimItem.onCancelled();
		inAnimItems._.splice( index, 1 );

	},

	find( el ) {

		return inAnimItems._[ inAnimItems.findIndex( el ) ];

	},

	findIndex( el ) {

		let index = - 1;

		inAnimItems._.some( ( item, i ) => {

			if ( item.el === el ) {

				index = i;
				return true;

			}

		} );

		return index;

	}

};

const CSS_EASEOUT_EXPO = 'cubic-bezier( 0.19, 1, 0.22, 1 )';

export function slideDown( el, options ) {

	if ( inAnimItems.findIndex( el ) !== - 1 ) return;

	const _isVisible = isVisible( el );
	const hasEndHeight = typeof options.endHeight === 'number';

	const onComplete  = options && options.onComplete  || function () {};
	const onCancelled = options && options.onCancelled || function () {};

	const defaultStyle = el.getAttribute( 'style' ) || '';
	const style = window.getComputedStyle( el );
	const defaultStyles = getDefaultStyles( el );
	const isBorderBox = /border-box/.test( style.getPropertyValue( 'box-sizing' ) );

	const contentHeight = defaultStyles.height;
	const paddingTop = defaultStyles.paddingTop;
	const paddingBottom = defaultStyles.paddingBottom;
	const borderTop = defaultStyles.borderTop;
	const borderBottom = defaultStyles.borderBottom;

	const duration = options && options.duration || 400;
	const cssDuration = `${ duration }ms`;
	const cssEasing = CSS_EASEOUT_EXPO;
	const cssTransition = [
		`height ${ cssDuration } ${ cssEasing }`,
		`padding ${ cssDuration } ${ cssEasing }`,
		`border-width ${ cssDuration } ${ cssEasing }`
	].join();

	const startHeight            = _isVisible ? style.height            : '0px';
	const startPaddingTop        = _isVisible ? style.paddingTop        : '0px';
	const startPaddingBottom     = _isVisible ? style.paddingBottom     : '0px';
	const startBorderTopWidth    = _isVisible ? style.borderTopWidth    : '0px';
	const startBorderBottomWidth = _isVisible ? style.borderBottomWidth : '0px';

	const endHeight = ( () => {

		if ( hasEndHeight ) return `${ options.endHeight }px`;

		return ! isBorderBox ?
			`${ height - paddingTop - paddingBottom - borderTop - borderBottom }px` :
			`${ height + borderTop + borderBottom }px`;

	} )();
	const endPaddingTop        = `${ paddingTop    }px`;
	const endPaddingBottom     = `${ paddingBottom }px`;
	const endBorderTopWidth    = `${ borderTop     }px`;
	const endBorderBottomWidth = `${ borderBottom  }px`;

	if (
		startHeight === endHeight &&
		startPaddingTop === endPaddingTop &&
		startPaddingBottom === endPaddingBottom &&
		startBorderTopWidth === endBorderTopWidth &&
		startBorderBottomWidth === endBorderBottomWidth
	) {

		onComplete();
		return;

	}

	requestAnimationFrame( () => {

		el.style.height            = startHeight;
		el.style.paddingTop        = startPaddingTop;
		el.style.paddingBottom     = startPaddingBottom;
		el.style.borderTopWidth    = startBorderTopWidth;
		el.style.borderBottomWidth = startBorderBottomWidth;
		el.style.display           = 'block';
		el.style.overflow          = 'hidden';
		el.style.visibility        = 'visible';
		el.style.transition        = cssTransition;
		el.style.webkitTransition  = cssTransition;

		requestAnimationFrame( () => {

			el.style.height            = endHeight;
			el.style.paddingTop        = endPaddingTop;
			el.style.paddingBottom     = endPaddingBottom;
			el.style.borderTopWidth    = endBorderTopWidth;
			el.style.borderBottomWidth = endBorderBottomWidth;

		} );

	} );

	const timeoutId = setTimeout( () => {

		// el.setAttribute( 'style', defaultStyle );
		resetStyle( el );
		el.style.display = 'block';
		if ( hasEndHeight ) {

			el.style.height = `${ options.endHeight }px`;
			el.style.overflow = `hidden`;

		}
		inAnimItems.remove( el );

		onComplete();

	}, duration );

	inAnimItems.add( el, defaultStyle, timeoutId, onCancelled );

}

export function slideUp( el, options ) {

	if ( inAnimItems.findIndex( el ) !== - 1 ) return;

	const _isVisible = isVisible( el );

	const onComplete  = options && options.onComplete  || function () {};
	const onCancelled = options && options.onCancelled || function () {};

	if ( ! _isVisible ) {

		onComplete();
		return;

	}

	const defaultStyle = el.getAttribute( 'style' ) || '';
	const style = window.getComputedStyle( el );
	const isBorderBox = /border-box/.test( style.getPropertyValue( 'box-sizing' ) );
	const paddingTop = + style.getPropertyValue( 'padding-top' ).replace( /px/, '' );
	const paddingBottom = + style.getPropertyValue( 'padding-bottom' ).replace( /px/, '' );
	const borderTop = + style.getPropertyValue( 'border-top-width' ).replace( /px/, '' );
	const borderBottom = + style.getPropertyValue( 'border-bottom-width' ).replace( /px/, '' );
	const contentHeight = el.scrollHeight;
	const duration = options && options.duration || 400;
	const cssDuration = duration + 'ms';
	const cssEasing = CSS_EASEOUT_EXPO;
	const cssTransition = [
		`height ${ cssDuration } ${ cssEasing }`,
		`padding ${ cssDuration } ${ cssEasing }`,
		`border-width ${ cssDuration } ${ cssEasing }`
	].join();

	const startHeight = ! isBorderBox ?
		`${ contentHeight - paddingTop - paddingBottom }px` :
		`${ contentHeight + borderTop + borderBottom }px`;
	const startPaddingTop        = `${ paddingTop    }px`;
	const startPaddingBottom     = `${ paddingBottom }px`;
	const startBorderTopWidth    = `${ borderTop     }px`;
	const startBorderBottomWidth = `${ borderBottom  }px`;

	requestAnimationFrame( () => {

		const height = ! isBorderBox ?
			contentHeight - paddingTop - paddingBottom :
			contentHeight + borderTop + borderBottom;

		el.style.height            = startHeight;
		el.style.paddingTop        = startPaddingTop;
		el.style.paddingBottom     = startPaddingBottom;
		el.style.borderTopWidth    = startBorderTopWidth;
		el.style.borderBottomWidth = startBorderBottomWidth;
		el.style.overflow          = 'hidden';
		el.style.transition        = cssTransition;
		el.style.webkitTransition  = cssTransition;

		requestAnimationFrame( () => {

			el.style.height            = 0;
			el.style.paddingTop        = 0;
			el.style.paddingBottom     = 0;
			el.style.borderTopWidth    = 0;
			el.style.borderBottomWidth = 0;

		} );

	} );

	const timeoutId = setTimeout( () => {

		// el.setAttribute( 'style', defaultStyle );
		resetStyle( el );
		el.style.display = 'none';
		inAnimItems.remove( el );
		onComplete();

	}, duration );

	inAnimItems.add( el, defaultStyle, timeoutId, onCancelled );

}

export function slideStop( el ) {

	const elementObject = inAnimItems.find( el );

	if ( ! elementObject ) return;

	const style = window.getComputedStyle( el );
	const height            = style.height;
	const paddingTop        = style.paddingTop;
	const paddingBottom     = style.paddingBottom;
	const borderTopWidth    = style.borderTopWidth;
	const borderBottomWidth = style.borderBottomWidth;

	resetStyle( el );
	el.style.height            = height;
	el.style.paddingTop        = paddingTop;
	el.style.paddingBottom     = paddingBottom;
	el.style.borderTopWidth    = borderTopWidth;
	el.style.borderBottomWidth = borderBottomWidth;
	el.style.overflow          = 'hidden';
	inAnimItems.remove( el );

}

export function isVisible( el ) {

	return el.offsetHeight !== 0;

}

function resetStyle( el ) {

	el.style.visibility        = '';
	el.style.height            = '';
	el.style.paddingTop        = '';
	el.style.paddingBottom     = '';
	el.style.borderTopWidth    = '';
	el.style.borderBottomWidth = '';
	el.style.overflow          = '';
	el.style.transition        = '';
	el.style.webkitTransition  = '';

}

function getDefaultStyles( el ) {

	const defaultStyle = el.getAttribute( 'style' ) || '';
	const style = window.getComputedStyle( el );

	el.style.visibility = 'hidden';
	el.style.display    = 'block';

	const width = + style.getPropertyValue( 'width' ).replace( /px/, '' );

	el.style.position = 'absolute';
	el.style.width    = `${ width }px`;
	el.style.height            = '';
	el.style.paddingTop        = '';
	el.style.paddingBottom     = '';
	el.style.borderTopWidth    = '';
	el.style.borderBottomWidth = '';

	const paddingTop = + style.getPropertyValue( 'padding-top' ).replace( /px/, '' );
	const paddingBottom = + style.getPropertyValue( 'padding-bottom' ).replace( /px/, '' );
	const borderTop = + style.getPropertyValue( 'border-top-width' ).replace( /px/, '' );
	const borderBottom = + style.getPropertyValue( 'border-bottom-width' ).replace( /px/, '' );
	const height = el.scrollHeight;

	el.setAttribute( 'style', defaultStyle );

	return {
		height,
		paddingTop,
		paddingBottom,
		borderTop,
		borderBottom
	};

}
