/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Geometry = require('math/Geometry');
var _ = require('lodash');
var ComponentViewFactory =
	require('components/app_deck/views/ComponentViewFactory');

require('components/OperatingTable.css');

var OperatingTable = React.createClass({
	_computeOtsSquare: function() {
		var deck = this.props.deck;
		var slideWidth = deck.config.slideWidth;
		var slideHeight = deck.config.slideHeight;

		var rootElSize = window.getComputedStyle(this.refs.rootEl.getDOMNode());

		if (!rootElSize)
			return {};

		var width = parseInt(rootElSize.width);
		var height = parseInt(rootElSize.height);

		var scale = Geometry.getFitSquareScaleFactor(
			slideWidth,
			slideHeight,
			width,
			height - 20
		);

		var leftOffset = (width - slideWidth * scale) / 2;
		var topOffset = (height - slideHeight * scale) / 2;

		return [
			scale,
			{
				transform: 'scale(' + scale + ')',
				marginLeft: leftOffset + 'px',
				width: slideWidth,
				height: slideHeight
			}
		];
	},

	_resized: function() {
		var style = this._computeOtsSquare();
		this.setState({
			otsStyle: style[1],
			scale: style[0]
		});
	},

	onClick() {
		var slide = this.props.deck.getSelectedSlide();
		if (slide) {
			slide.unselectComponents();
		}
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		this._resized();

		window.addEventListener('resize', this._resized);
	},

	componentWillUnmount: function() {
		window.removeEventListener('resize', this._resized);
	},

	renderComponent: function(slide, component) {
		var Node = ComponentViewFactory(component);
		return (
			<Node
				model={component}
				slide={slide}
				key={component.id}
				containerScale={this.state.scale}
			/>
		)
	},

	render: function() {
		var slide = this.props.deck.getSelectedSlide();
		var components = null;
		if (slide) {
			components = slide.components.map(
				this.renderComponent.bind(null, slide)
			);
		}

		return (
			<div
				className="strt-operating-table"
				ref="rootEl"
				onClick={this.onClick}>
				<div className="strt-ot-slide" style={this.state.otsStyle}>
					{components}
				</div>
			</div>
		);
	}
});

module.exports = OperatingTable;
