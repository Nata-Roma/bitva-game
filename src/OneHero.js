/* eslint-disable max-len */
/* eslint-disable import/no-duplicates */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/App.css';
import './css/HeroSelection.css';
import styles from './css/HeroSelection.module.css';

import yaga from './images/heroes/yaga.jpg';
import morevna from './images/heroes/morevna.jpg';

import apple from './images/cards/apple.png';
import bajun from './images/cards/bajun.png';
import sivka from './images/cards/sivka.png';
import bereginya from './images/cards/bitva-cardbase.jpg';
import bogatyr from './images/cards/bitva-cardbase.jpg';
import shieldLarge from './images/cards/bitva-cardbase.jpg';
import shieldSmall from './images/cards/bitva-cardbase.jpg';
import wolf from './images/cards/bitva-cardbase.jpg';
import cardPlace from './images/cards/cardPlace.png';


const images = {
    yaga,
    morevna,
};

const imagesCards = {
    apple,
    bajun,
    sivka,
    bereginya,
    bogatyr,
    shieldLarge,
    shieldSmall,
    wolf,
    cardPlace,
};


// Show all cards by pairs (3 in row)
function prepairCards(cards) {
    const cardsKeys = Object.keys(cards);
    const cardsBy3 = [];
    for (let i = 0; i < cardsKeys.length; i += 3) {
        cardsBy3.push(cardsKeys.slice(i, i + 3));
    }
    return cardsBy3;
}

const HeroImage = props => (
    <div className="details-hero">
        <div className="details-hero-avatar" style={{ backgroundImage: `url(${images[props.heroid]})`, backgroundSize: 'cover' }}>
            <div className="icon-deck icon-text">
                {props.hero.cardsNumber}
            </div>
            <div className="icon icon-text icon-heal">
                {props.hero.health}
            </div>
        </div>
    </div>
);

const CardPreview = props => (
    props.card
        ? (
            <div className="details-card" style={{ backgroundImage: `url(${imagesCards[props.card.id]})`, backgroundSize: '100% 100%' }}>
                <div className="card-header">
                    <div className="icon-deck icon-text">
                        {props.card.count}
                    </div>
                    <p>{props.card.name}</p>
                    <div className={`icon icon-text ${props.card.category === 'heal' ? 'icon-heal' : null} ${props.card.category === 'attack' ? 'icon-attack' : null} ${props.card.category === 'shield' ? 'icon-shield' : null}`}>{props.card.points}</div>
                </div>
                <div className="card-description">{props.card.info}</div>
            </div>
        )
        : <img className="details-card" style={{ opacity: '0.25' }} src={imagesCards.cardPlace} alt="card" />
);

const CardsRow = props => (
    <>
        <CardPreview card={props.cards[props.row[0]]} />
        <CardPreview card={props.cards[props.row[1]]} />
        <CardPreview card={props.cards[props.row[2]]} />
    </>
);

class CardsBlock extends Component {
    constructor(props) {
        super(props);
        this.cardsBy3 = prepairCards(props.cards);
        this.state = { row: 0 };
        this.changeRow = this.changeRow.bind(this);
    }

    changeRow() {
        console.log('changeRow ', this.state.row);
        const maxRotation = this.cardsBy3.length - 1;
        const currentRow = this.state.row;
        if (currentRow === maxRotation) {
            this.setState({ row: 0 });
        } else {
            this.setState({ row: currentRow + 1 });
        }
    }

    render() {
        return (
            <section className="details-cards">
                <div className="btn cards-btn cards-btn-left" role="button" onClick={this.changeRow} onKeyPress={this.changeRow} tabIndex="5">
                    ◀
                </div>
                <CardsRow heroId={this.props.heroId} row={this.cardsBy3[this.state.row]} cards={this.props.cards} />
                <div className="btn cards-btn cards-btn-right" role="button" onClick={this.changeRow} onKeyPress={this.changeRow} tabIndex="6">
                    ▶
                </div>
            </section>
        );
    }
}

// Info about one hero.
const OneHero = props => (
    <div className={styles.details}>
        <HeroImage heroid={props.hero.id} hero={props.hero} />
        <div className="details-info-block">
            <article className="details-description">
                <span>
                    {props.hero.description}
                    {console.log('PROPS HERO ', props.hero.cards)}
                </span>
            </article>
            <CardsBlock heroId={props.hero.id} cards={props.hero.cards} />
        </div>
    </div>
);

HeroImage.propTypes = {
    heroid: PropTypes.string.isRequired,
    hero: PropTypes.object.isRequired,
};

CardPreview.propTypes = {
    card: PropTypes.object,
};

CardPreview.defaultProps = {
    card: undefined,
};

CardsRow.propTypes = {
    card: PropTypes.object,
};

CardsBlock.propTypes = {
    cards: PropTypes.object.isRequired,
    heroId: PropTypes.string.isRequired,
};

OneHero.propTypes = {
    hero: PropTypes.object.isRequired,
};

export default OneHero;