/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Cancel from '@mui/icons-material/Cancel';
import Clear from '@mui/icons-material/Clear';
import StarRate from '@mui/icons-material/StarRate';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Alert from 'AppComponents/Shared/Alert';
import Api from 'AppData/api';
import AuthManager from 'AppData/AuthManager';
import StarRatingSummary from 'AppComponents/Apis/Details/StarRatingSummary';
import Rating from '@mui/material/Rating';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useTheme } from '@mui/material';

const PREFIX = 'StarRatingBarLegacy';

const classes = {
    starRate: `${PREFIX}-starRate`,
    noStarRate: `${PREFIX}-noStarRate`,
    iconFilled: `${PREFIX}-iconFilled`,
    iconEmpty: `${PREFIX}-iconEmpty`,
    removeRating: `${PREFIX}-removeRating`,
    closeRating: `${PREFIX}-closeRating`,
    userRating: `${PREFIX}-userRating`,
    rateThis: `${PREFIX}-rateThis`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
    {
        theme,
    },
) => ({
    [`& .${classes.starRate}`]: {
        fontSize: 30,
        color: theme.custom.infoBar.starColor,
    },

    [`& .${classes.noStarRate}`]: {
        fontSize: 30,
        color: theme.palette.grey.A400,
    },

    [`& .${classes.iconFilled}`]: {
        color: theme.custom.infoBar.starColor,
    },

    [`& .${classes.iconEmpty}`]: {
        color: theme.custom.infoBar.starColorEmpty || '#cfcfcf',
    },

    [`& .${classes.removeRating}`]: {
        fontSize: 20,
        color: theme.palette.getContrastText(theme.custom.infoBar.background),
    },

    [`& .${classes.closeRating}`]: {
        position: 'absolute',
        right: theme.spacing(-2),
        top: theme.spacing(-2),
    },

    [`& .${classes.userRating}`]: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '5px',
        background: '#efefef',
        borderRadius: '3px',
        position: 'absolute',
        right: 0,
        top: '-50px',
        marginLeft: '125px',
    },

    [`& .${classes.rateThis}`]: {
        lineHeight: '15px',
        width: 40,
    },
}));

/**
 *
 *
 * @class StarRatingBarLegacy
 * @extends {React.Component}
 */
class StarRatingBarLegacy extends React.Component {
    /**
     *Creates an instance of RecommendedApiThumb.
     * @param {JSON} props properties
     * @memberof StarRatingBarLegacy
     */
    constructor(props) {
        super(props);
        this.state = {
            avgRating: 0,
            userRating: 0,
            count: 0,
            total: 0,
            showEditing: false,
        };
        this.getApiRating = this.getApiRating.bind(this);
        this.removeUserRating = this.removeUserRating.bind(this);
        this.doRate = this.doRate.bind(this);
        this.toggleEditRating = this.toggleEditRating.bind(this);
    }

    /**
     * Component did mount callback.
     * @memberof StarRatingBarLegacy
     */
    componentDidMount() {
        this.getApiRating();
    }

    /**
     * Component did mount callback.
     * @param {JSON} prevProps previous instance properties
     * @memberof StarRatingBarLegacy
     */
    componentDidUpdate(prevProps) {
        const { ratingUpdate } = this.props;
        if (ratingUpdate !== prevProps.ratingUpdate) {
            this.getApiRating();
        }
    }

    /**
     *
     *
     * @memberof StarRatingBarLegacy
     */
    getApiRating() {
        const { apiId, setRatingUpdate } = this.props;
        const user = AuthManager.getUser();
        const api = new Api();
        // get api rating
        if (user != null) {
            const promisedRating = api.getRatingFromUser(apiId, null);
            promisedRating.then((response) => {
                this.setState({
                    avgRating: response.body.avgRating,
                    userRating: response.body.userRating,
                    count: response.body.count,
                    total: response.body.pagination.total,
                });
                if (setRatingUpdate) {
                    setRatingUpdate({
                        avgRating: response.body.avgRating,
                        count: response.body.count,
                        total: response.body.pagination.total,
                    });
                }
            });
        }
    }

    /**
     *
     *
     * @param {*} rateIndex
     * @memberof StarRatingBarLegacy
     */
    doRate(rateIndex) {
        const { apiId, intl } = this.props;
        const api = new Api();
        const ratingInfo = { rating: rateIndex };
        const promise = api.addRating(apiId, ratingInfo);
        promise
            .then(() => {
                this.getApiRating();
            })
            .catch((error) => {
                Alert.error(intl.formatMessage({
                    defaultMessage: 'Error occurred while adding ratings',
                    id: 'Apis.Listing.StarRatingBar.error.occurred.adding',
                }));
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
            })
            .finally(() => {
                this.toggleEditRating();
            });
    }

    /**
     * @memberof StarRatingBarLegacy
     */
    removeUserRating() {
        const { apiId, setRatingUpdate, intl } = this.props;
        const api = new Api();
        // remove user rating
        api.removeRatingOfUser(apiId, null)
            .then(() => {
                this.getApiRating();
                setRatingUpdate();
            })
            .catch((error) => {
                Alert.error(intl.formatMessage({
                    defaultMessage: 'Error occurred while removing ratings',
                    id: 'Apis.Listing.StarRatingBar.error.occurred',
                }));
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
            })
            .finally(() => {
                this.toggleEditRating();
            });
    }

    /**
     * @memberof StarRatingBarLegacy
     */
    toggleEditRating() {
        this.setState((prevState) => ({ showEditing: !prevState.showEditing }));
    }

    /**
     * @returns {JSX} star rating bar
     * @memberof StarRatingBarLegacy
     */
    render() {
        const {
            avgRating, userRating, count, total, showEditing,
        } = this.state;
        const {
            isEditable, showSummary, apiRating,
        } = this.props;
        const apiRatingNumber = parseFloat(apiRating);
        return (
            <Root>
                {showSummary ? (
                    <StarRatingSummary avgRating={avgRating} reviewCount={total} returnCount={count} />
                ) : (
                    <>
                        {isEditable ? (
                            <Box position='relative'>
                                <IconButton
                                    component='div'
                                    onClick={this.toggleEditRating}
                                    display='flex'
                                    style={{ cursor: 'pointer' }}
                                    size='large'
                                >
                                    {(userRating === 0)
                                        ? (<StarBorderIcon style={{ fontSize: 30 }} />)
                                        : (<StarIcon style={{ fontSize: 30, color: '#75d5fa' }} />)}
                                    <Typography variant='body2' className={classes.rateThis}>
                                        {(userRating === 0) ? (
                                            <FormattedMessage defaultMessage='Rate This' id='Apis.Listing.StarRatingBar.rate.this' />
                                        ) : (
                                            <Box>
                                                <Box fontSize={22} ml={1} mb={0.5}>{userRating}</Box>
                                                <Box><FormattedMessage defaultMessage='You' id='Apis.Listing.StarRatingBar.you' /></Box>
                                            </Box>
                                        )}
                                    </Typography>
                                </IconButton>
                                {showEditing && (
                                    <>
                                        <ClickAwayListener onClickAway={this.toggleEditRating}>
                                            <div className={classes.userRating}>
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <IconButton area-label={'Rate ' + i} onClick={() => this.doRate(i)} size='large'>
                                                        <StarRate
                                                            key={i}
                                                            className={userRating >= i ? classes.starRate : classes.noStarRate}
                                                        />
                                                    </IconButton>
                                                ))}
                                                <IconButton
                                                    area-label='Clear rating'
                                                    onClick={() => this.removeUserRating()}
                                                    size='large'
                                                >
                                                    <Clear
                                                        className={classes.removeRating}
                                                    />
                                                </IconButton>
                                                <IconButton
                                                    className={classes.closeRating}
                                                    area-label='Close rating popup'
                                                    onClick={this.toggleEditRating}
                                                    size='large'
                                                >
                                                    <Cancel
                                                        className={classes.removeRating}
                                                    />
                                                </IconButton>
                                            </div>
                                        </ClickAwayListener>
                                    </>
                                )}
                            </Box>
                        ) : (
                            <>
                                <Rating
                                    name='half-rating'
                                    value={apiRatingNumber}
                                    precision={0.1}
                                    readOnly
                                    classes={{ iconEmpty: classes.iconEmpty, iconFilled: classes.iconFilled }}
                                />
                                <Typography variant='caption' gutterBottom align='left' component='div'>
                                    {`${apiRating}/5.0`}
                                    {total > 0 && (
                                        <>
                                            {` (${total} `}
                                            {total === 1 ? (
                                                <FormattedMessage defaultMessage='user' id='Apis.Listing.StarRatingBar.user' />
                                            ) : (
                                                <FormattedMessage defaultMessage=' users' id='Apis.Listing.StarRatingBar.users' />
                                            )}
                                            &lsquo;&#41;&rsquo;
                                        </>
                                    )}

                                </Typography>
                            </>
                        )}
                    </>
                )}
            </Root>
        );
    }
}

StarRatingBarLegacy.defaultProps = {
    apiRating: 0,
    ratingUpdate: 0,
    setRatingUpdate: () => { },
};

StarRatingBarLegacy.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
    apiId: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    showSummary: PropTypes.bool.isRequired,
    apiRating: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    ratingUpdate: PropTypes.number,
    setRatingUpdate: PropTypes.func,
};

function StarRatingBar(props) {
    const {
        apiRating, apiId, isEditable, showSummary,
    } = props;
    const theme = useTheme();
    return (
        <StarRatingBarLegacy
            apiRating={apiRating}
            apiId={apiId}
            isEditable={isEditable}
            showSummary={showSummary}
            theme={theme}
        />
    );
}

export default injectIntl((StarRatingBar));
