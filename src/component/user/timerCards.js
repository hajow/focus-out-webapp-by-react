import React, { Component } from 'react';
import { connect } from 'react-redux';

import TimerCard from './timerCard';
import AddCard from './addCard';

import addTimerCard from '../../action/addTimerCard';
import deleteTimerCard from '../../action/deleteTimerCard';

class TimerCards extends Component {

	constructor () {
		super();

		this.pointer = 0;
	}

	/**
	 * 左移
	 */
	moveLeft () {
		let cardBox = this.refs.cardBox;
		let initLeft = parseFloat(window.getComputedStyle(cardBox).left);
		let i = 0;

		if (this.pointer < this.cardSum - 1) {
			let interval = setInterval(()=> {
				let currentLeft = parseFloat(window.getComputedStyle(cardBox).left);
				cardBox.style.left = ( currentLeft - 238 / 25 ) + 'px';
				i++;
				if (i === 25) {
					cardBox.style.left = ( initLeft - 238 ) + 'px';
					clearInterval(interval);
				}
			},10);
			cardBox.children[this.pointer].className = cardBox.children[this.pointer].className.replace(' timerCard-focus', '');
			this.pointer++;
			cardBox.children[this.pointer].className += ' timerCard-focus';
		}
	}

	/**
	 * 右移
	 */
	moveRight () {
		let cardBox = this.refs.cardBox;
		let initLeft = parseFloat(window.getComputedStyle(cardBox).left);
		let i = 0;

		if (this.pointer > 0) {
			let interval = setInterval(()=> {
				let currentLeft = parseFloat(window.getComputedStyle(cardBox).left);
				cardBox.style.left = ( currentLeft + 238 / 25 ) + 'px';
				i++;
				if (i === 25) {
					cardBox.style.left = ( initLeft + 238 ) + 'px';
					clearInterval(interval);
				}
			},10);
			cardBox.children[this.pointer].className = cardBox.children[this.pointer].className.replace(' timerCard-focus', '');
			this.pointer--;
			cardBox.children[this.pointer].className += ' timerCard-focus';
		}
	}

	/**
	 * 点击添加按钮时的行为
	 */
	addFunc () {
		let cardBox = this.refs.cardBox;
		let initLeft = parseFloat(window.getComputedStyle(cardBox).left);
		let i = 0;

		let interval = setInterval(()=> {
			let currentLeft = parseFloat(window.getComputedStyle(cardBox).left);
			cardBox.style.left = ( currentLeft - 238 / 25 ) + 'px';
			i++;
			if (i === 25) {
				cardBox.style.left = ( initLeft - 238 ) + 'px';
				clearInterval(interval);
			}
		},10);
		cardBox.children[this.pointer].className = cardBox.children[this.pointer].className.replace(' timerCard-focus', '');
		this.pointer++;

		cardBox.querySelector('.plus').style.display = 'none';
		cardBox.querySelector('.editArea').style.visibility = 'visible';
		cardBox.querySelector('.addCard').className += ' addCard-focus';
		cardBox.querySelector('.buttonGroup').style.display = 'block';
	}

	/**
	 * 添加卡片时，按确定键
	 */
	resolve () {
		let data = [];
		this.refs.addCard.refs.addCard.querySelectorAll('input').forEach( v => {
			data.push(v.value);
		});
		let newTimerCard = {
			name: data[0],
			target: parseInt(data[1]),
			work: parseInt(data[2]),
			break: parseInt(data[3])
		}
		this.props.dispatch(addTimerCard(newTimerCard));
		this.reject();
		this.forceUpdate();
	}

	/**
	 * 添加卡片时，按取消键
	 */
	reject () {
		let cardBox = this.refs.cardBox;
		let initLeft = parseFloat(window.getComputedStyle(cardBox).left);
		let i = 0;


		let interval = setInterval(()=> {
			let currentLeft = parseFloat(window.getComputedStyle(cardBox).left);
			cardBox.style.left = ( currentLeft + 238 / 25 ) + 'px';
			i++;
			if (i === 25) {
				cardBox.style.left = ( initLeft + 238 ) + 'px';
				clearInterval(interval);
			}
		},10);
		this.pointer--;
		cardBox.children[this.pointer].className += ' timerCard-focus';

		cardBox.querySelector('.buttonGroup').style.display = 'none';
		cardBox.querySelector('.plus').style.display = 'block';
		cardBox.querySelector('.editArea').style.visibility = 'hidden';
		cardBox.querySelector('.addCard.addCard-focus').className = cardBox.querySelector('.addCard.addCard-focus').className.replace(' addCard-focus', '');
	}

	/**
	 * 删除计时器
	 * @param  id : 计时器 id
	 */
	delete (id) {
		if (id !== 1) {
			this.props.timers.splice(id - 1, 1);
			this.props.timers.forEach((v, i) => {
				v.id = i + 1;
			});
			this.props.dispatch(deleteTimerCard(this.props.timers));
			if(this.pointer === this.cardSum - 1) {
				this.moveRight();
			} 
			this.forceUpdate();
		} else {
			alert('最后一张了，饶了小的吧。（提示：若要修改信息，可以直接点击修改。）');
		}
	}

	render () {
		let timerCards = [];
		this.props.timers.forEach((v, i) => {
			timerCards.push(<TimerCard key={ v.name } info={ v } focus={ i === 0 } dispatch={ this.props.dispatch } delete={ (id) => this.delete(id) }/>);
		});
		this.cardSum = this.props.timers.length;

		return (
			<div className="timerCards">
				<div className="button" onClick={ () => this.moveRight() }><i className="iconfont icon-left"></i></div>
				<div className="frame-timerCards">
					<div className="box-timerCards" ref="cardBox">
						{ timerCards }
						<AddCard ref="addCard" addFunc={ () => this.addFunc() } resolve={ () => this.resolve() } dispatch={ this.props.dispatch } reject={ () => this.reject() }/>
					</div>
				</div>
				<div className="button" onClick={ () => this.moveLeft() }><i className="iconfont icon-right"></i></div>
			</div>
		)
	}
}

TimerCards.contextTypes = {
	router: React.PropTypes.object
}
TimerCards.propTypes = {
	timers: React.PropTypes.array
}

let timerCards = connect((state) => {
	return {
		timers: state.userInfo.timers
	}
})(TimerCards);

export default timerCards;