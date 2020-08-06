import React, { Component } from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'

import './SearchResult.css';
import './SearchParallax.scss';

import Tilt from 'react-parallax-tilt';

const has_scenes_image = require ('../img/does-have-scenes.png');
const doesnt_have_scenes_image = require ('../img/does-not-have-scenes.png');
const missing_image = require ('../img/missing-image.png');

class SearchResult extends Component {
    constructor (props) {
        super (props);
        this.state = {
            isShown: true,
            isLoading: true,
            id: props.id,
            movieTitle: props.title,
            voteAverage: props.voteAverage,
            releaseDate: props.releaseDate,
            overview: props.overview,
            movieBackdrop: props.backdrop ? `https://image.tmdb.org/t/p/w500/${props.backdrop}` : missing_image,
            moviePoster: `https://image.tmdb.org/t/p/w500/${props.poster}`, //'kqjL17yufvn9OVLyXYpvtyrFfak.jpg',
            hasPostCreditsScenes: false
        }
    }

    componentDidMount () {
        const { id } = this.state;
        fetch (`https://www.sphynxgames.com/AfterCreditsSubmitter/getmovie.php?id=${id}`)
            .then (res => res.text ())
            .then (res => {
                this.setState ({
                    isLoading: false,
                    hasPostCreditsScenes: res === "1" ? true : false
                });
            });
    }

    render () {
        const { isShown, isLoading, movieTitle, moviePoster, movieBackdrop, voteAverage, releaseDate, hasPostCreditsScenes } = this.state;
        return (
            <span style = {{textAlign: 'center'}}>
                { isShown ? (
                    <Tilt
                        className = "parallax-effect-glare-scale"
                        perspective = { 1000 }
                        glareEnable = { true }
                        glareMaxOpacity = { 0.10 }
                        scale = { 1.02 }
                        tiltMaxAngleX = { 5 }
                        tiltMaxAngleY = { 5 }
                        gyroscope = { true }
                    >
                        <Card className = "search-result-card" border = "primary">
                        <img src = {movieBackdrop} style = {{
                            position: 'absolute',
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            filter: 'blur(3px) brightness(50%)'
                        }}></img>
                        <Row>
                            <Col>
                            <Card.Body>
                                <Card.Title>{ movieTitle } ({new Date (releaseDate).getFullYear ()})</Card.Title>
                                {isLoading ? 'LOADING' : (
                                    <img style = {{
                                        position: 'absolute',
                                        bottom: '.5em',
                                        left: '0',
                                        boxShadow: 'none !important'
                                    }} className = "inner-element hide-shadow" src = {hasPostCreditsScenes ? has_scenes_image : doesnt_have_scenes_image}
                                    alt = "has or doesn't have extra scenes"/>
                                )}
                                <div style = {{
                                    marginTop: '1em'
                                }}>
                                    <span aria-label = "star emoji" role = "img">⭐{voteAverage}</span> 
                                </div>
                            </Card.Body>
                            </Col>
                            <Col>
                            <Card.Img className = "inner-element" src = {moviePoster}/>
                            </Col>
                        </Row>
                    </Card>
                    </Tilt>
                ) : (
                    ''
                ) }
            </span>
            
        )
    }
}

export default SearchResult;