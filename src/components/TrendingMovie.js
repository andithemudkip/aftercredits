import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import './TrendingMovie.css';

import './TrendingParallax.scss';

import Tilt from 'react-parallax-tilt';

const has_scenes_image = require ('../img/does-have-scenes.png');
const doesnt_have_scenes_image = require ('../img/does-not-have-scenes.png');
const missing_image = require ('../img/missing-image.png');

class TrendingMovie extends Component {
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
            moviePoster: `https://image.tmdb.org/t/p/w500/${props.poster}`,
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
        const { isLoading, movieTitle, movieBackdrop, voteAverage, releaseDate, hasPostCreditsScenes } = this.state;
        return (
            <Tilt
                className = "trending-parallax-effect-glare-scale"
                perspective = { 1000 }
                glareEnable = { false }
                scale = { 1.02 }
                tiltMaxAngleX = { 5 }
                tiltMaxAngleY = { 5 }
                gyroscope = { true } 
            >
                <Card className = "trending-movie-card">
                    <Card.Img src = {movieBackdrop}/>
                    <Card.ImgOverlay style = {{backgroundColor: 'rgba(0, 0, 0, .35)'}}>
                        <Card.Title>{movieTitle} ({new Date (releaseDate).getFullYear ()})</Card.Title>
                        {isLoading ? 'LOADING' : (
                            <img style = {{
                                position: 'absolute',
                                bottom: '.5em',
                                left: '.5em'
                            }} src = {hasPostCreditsScenes ? has_scenes_image : doesnt_have_scenes_image}
                            alt = "has or doesn't have extra scenes"/>
                        )}
                        <span style = {{
                            position: 'absolute',
                            top: '.5em',
                            right: '.5em'
                        }}>
                            <span aria-label = "star emoji" role = "img">⭐{voteAverage}</span> 
                        </span>
                    </Card.ImgOverlay>
                </Card>
            </Tilt>
            
        )
    }
}

export default TrendingMovie;