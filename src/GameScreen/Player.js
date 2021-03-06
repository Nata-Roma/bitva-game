/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-duplicates */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Hero from './Hero';
import Card from './Card';
import Item from './Item';
import Hand from './Hand';
import Grave from './Grave';
import '../css/App.css';
import '../css/GameScreen.css';

import bat from '../images/cards/batCard.png';

const { animation: animationConst } = require('../constants');

const AnimatedHand = ({ inactivePlayer, hand }) => (
    <div className="hand card-hand">
        {Object.keys(hand).map((cardId) => (
            <div key={cardId} className="card-place card-like">
                <Card cardKey={cardId} card={hand[cardId]} player={inactivePlayer} />
            </div>
        ))}
    </div>
);

// Clairvoyance showed 3 1st cards from deck -from backend
// this function create them to appear with 3 different
// classNames for each to create different animation
function Clairvoyance({ player }) {
    const findPosition = (index, length) => {
        if (index === 2) {
            return 'upper';
        }
        if (index === 1) {
            return 'middle';
        }
        if (index === 0 && length > 1) {
            return 'bottom';
        }
        if (index === 0 && length === 1) {
            return 'bottom-static';
        }
    };

    return (
        <div>
            {Object.keys(player.cardsShown).map((cardId, index) => (
                <div
                    key={cardId}
                    className={`card-place card-like clairvoyance ${findPosition(index, Object.keys(player.cardsShown).length)}`}
                >
                    <Card
                        cardKey={cardId}
                        card={player.cardsShown[cardId]}
                        player={player}
                    />
                </div>
            ))}
        </div>
    );
}

// bat card image for malachite box card
// once in item holder, malachite box generates bat card
// that attacks opponent with any other player action
const BatCard = () => (
    <div className="item-attacks">
        <img className="bat-img" src={bat} alt="bat card" />
    </div>
);

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation: null,
        };
        this.playAnimation = this.playAnimation.bind(this);
    }

    componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    // animation for cards deal from gravyeard to deck
        if (this.props.player.deal !== prevProps.player.deal) {
            this.playAnimation(animationConst.CARDS);
        }
        // animation for Turning Potion - active player gets cards from inactive player hand
        if (
            this.props.player.turningHand !== prevProps.player.turningHand
      && this.props.player.turningHand === true
        ) {
            this.playAnimation(animationConst.POTION);
        }
    }

    playAnimation(animName) {
        // console.log('We are in Animation!', animName);
        this.setState({ animation: animName });
        setTimeout(() => this.setState({ animation: null }), 2000);
    }

    render() {
        const playerClass = this.props.active ? 'player-active' : 'player-inactive';
        const playerPosition = this.props.active
            ? 'player player-bottom'
            : 'player player-top';
        return (
            <div className={`${playerPosition} ${playerClass}`}>
                <Hero
                    player={this.props.player}
                    active={this.props.active}
                    gamePhase={this.props.gamePhase}
                />
                <Item
                    item={Object.values(this.props.player.item)[0]}
                    player={this.props.player}
                    active={this.props.active}
                />
                {this.state.animation === animationConst.BAT ? <BatCard /> : null}
                <Deck
                    active={this.props.active}
                    cards={this.props.player.cards}
                    background={this.props.player.background}
                />
                {this.props.player.cardsShown ? (
                    <Clairvoyance player={this.props.player} active={this.props.active} />
                ) : null}
                <Hand
                    active={this.props.active}
                    inactivePlayer={this.props.inactivePlayer}
                    background={this.props.player.background}
                    hand={this.props.hand}
                    player={this.props.player}
                />
                {this.state.animation === animationConst.POTION && this.props.active ? (
                    <AnimatedHand
                        inactivePlayer={this.props.inactivePlayer}
                        hand={this.props.inactivePlayer.hand}
                    />
                ) : null}
                <Grave
                    player={this.props.player}
                    active={this.props.active}
                    grave={this.props.player.grave}
                    background={this.props.player.background}
                    animation={this.state.animation}
                />
            </div>
        );
    }
}

const Deck = (props) => (
    <div className={`deck card-like deck-${props.background}`}>
        <div className="count">
            {props.active
                ? Object.keys(props.cards).length
                : Object.keys(props.cards).length}
        </div>
    </div>
);

Deck.propTypes = {
    cards: PropTypes.object.isRequired,
    background: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
};

Player.propTypes = {
    player: PropTypes.object.isRequired,
    inactivePlayer: PropTypes.object.isRequired,
    hand: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    gamePhase: PropTypes.string.isRequired,
};

Hand.propTypes = {
    hand: PropTypes.object.isRequired,
    gamePhase: PropTypes.string,
};

Hand.defaultProps = {
    gamePhase: undefined,
};

AnimatedHand.propTypes = {
    hand: PropTypes.object.isRequired,
    inactivePlayer: PropTypes.object.isRequired,
};

Clairvoyance.propTypes = {
    player: PropTypes.object.isRequired,
};

export default Player;
