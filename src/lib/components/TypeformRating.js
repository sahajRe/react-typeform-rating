import React from 'react'

class TypeformRating extends React.Component {
	constructor(props) {
		super(props);

		this.name = props.name; //mandatory
		this.onChange = props.onChange; //mandatory

		this.emptyStar = props.emptyStar || "fa fa-star-o";
		this.selectedStar = props.selectedStar || "fa fa-star";
		this.halfSelectedStar = props.halfSelectedStar || "fa fa-star-half-empty";

		this.value = props.value || 0;
		this.starCount = props.starCount || 5;

		this.halfStarSelection = props.halfStarSelection || false;
		this.keyBasedSelection = props.keyBasedSelection || false;
		this.isFocused = props.isFocused || false;
		this.rightToLeft = props.rightToLeft || false;

		this.keyPressed = props.keyPressed;

		this.state = {rating: this.value, tempRating: this.value};
	}

	componentWillReceiveProps( nextProps ) {
		console.log(nextProps);
		console.log("nextProps.keyPressed " + this.name + " " +  nextProps.keyPressed);
		if(nextProps.keyPressed) {
			this.setState(this.setRating(nextProps.keyPressed - 48));
		}
  }

	setRating(rating) {
		  if(rating > this.starCount) {
				rating = this.starCount;
			}
			this.onChange({name: this.name, rating: rating});
			return {rating: rating, tempRating: rating};
	}

	handleClick = (index) => {
		this.setState(prevState => {
			if(prevState.rating === 0.5 && index === 1 && this.half === 0.5) { 
				return this.setRating(0);
			} else if(prevState.rating === 0.5 && index === 1 && this.half === 0) { 
				return this.setRating(1);
			} else if(prevState.rating === 1 && index === 1 && this.halfStarSelection === false) { 
				return this.setRating(0);
			} else {
				return this.setRating(prevState.tempRating);
			}
		});
	}

	handleMouseMove = (e, index) => {
		this.half = this.halfStarSelection ? (((e.pageX - this['star' + index].offsetLeft) < this['star' + index].offsetWidth / 2) ? 0.5 : 0) : 0;
		this.setState(prevState => {
			if(prevState.rating === 0.5 && index === 1 && this.half === 0.5) {
				return {tempRating: 0};
			} else if(prevState.rating === 0.5 && index === 1 && this.half === 0) {
				return {tempRating: 1};
			} else if(prevState.rating === 1 && index === 1 && this.halfStarSelection === false) {
				return {tempRating: 0};
			} else {
				return {tempRating: index-this.half};
			}
		});
	}

	handleMouseLeave = (index) => {
		this.setState(prevState => {
				return {tempRating: prevState.rating};
		});
	}

	getStarClass = (index) => {
		if( (index <= this.state.rating && index <= this.state.tempRating) || index <= this.state.tempRating ) {
			return this.selectedStar + ((index === this.state.rating) ? " rtr-flash" : ""); 
		} else if( (index-0.5 <= this.state.rating && index-0.5 <= this.state.tempRating) || index-0.5 <= this.state.tempRating ) {
			return this.halfSelectedStar + ((index === this.state.rating) ? " rtr-flash" : ""); 
		}

		return this.emptyStar;
	}

	render() {
		let stars = [];

		for(let i = 0; i < this.starCount; i++) {
			let index = this.rightToLeft ? (this.starCount - i) : (i+1);
			stars.push(
				<li 
					key={index} 
					ref={(indexElem) => this['star' + index] = indexElem} 
					onClick={() => this.handleClick(index)} 
					onMouseMove={(e) => this.handleMouseMove(e, index)} 
					onMouseLeave={() => this.handleMouseLeave(index)}
				>
					<i className={this.getStarClass(index)} ></i>
				  <div className={(index === this.state.rating) ? ' rtr-key-box rtr-flash' : 'rtr-key-box'}>{index}</div>
				</li>
			);
		}

		return (
				<ul className="rtr-rating">
					{stars}
        </ul>
		)	
	}
}

export default TypeformRating
