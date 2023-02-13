import assign from 'assign-deep';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import PagerView from "react-native-pager-view";
import DoneButton from './components/DoneButton';
import SkipButton from './components/SkipButton';
import RenderDots from './components/Dots';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

const defaulStyles = {
    header: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pic: {
        width: 150,
        height: 150
    },
    info: {
        flex: 0.5,
        alignItems: 'center',
        padding: 30,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        padding: 15,
    },
    title: {
        color: '#fff',
        fontSize: 30,
        paddingBottom: 20,
    },
    description: {
        color: '#fff',
        fontSize: 20,
    },
    controllText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    dotStyle: {
        backgroundColor: 'rgba(255,255,255,.3)',
        width: 13,
        height: 13,
        borderRadius: 7,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewSkip: {
        flexDirection: 'row',
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewDots: {
        flexDirection: 'row',
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewDoneButton: {
        flexDirection: 'row',
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeDotStyle: {
        backgroundColor: '#fff',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
    },
    paginationTopContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 25,
        flexDirection: 'row',
        flex: 1,
    },
    doneBtnBackView:{},
    dotContainer: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    },
    btnSkipContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    },
    nextButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    full: {
        height: 80,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewPager: {
        flex: 1
    },
    hidden: {overflow: 'hidden'}
}

export default class AppIntro extends Component {

    static propTypes = {
        dotColor: PropTypes.string,
        activeDotColor: PropTypes.string,
        rightTextColor: PropTypes.string,
        leftTextColor: PropTypes.string,
        onSlideChange: PropTypes.func,
        onPageScroll: PropTypes.func,
        onSkipBtnClick: PropTypes.func,
        onDoneBtnClick: PropTypes.func,
        onNextBtnClick: PropTypes.func,
        pageArray: PropTypes.array,
        doneBtnLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        skipBtnLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        nextBtnLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        customStyles: PropTypes.object,
        defaultIndex: PropTypes.number,
        showSkipButton: PropTypes.bool,
        showDoneButton: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        showDots: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        flexContainer: PropTypes.number,
        useNativeDriver: PropTypes.bool,
        showPaginationTop: PropTypes.bool
    };

    static defaultProps = {
        dotColor: 'rgba(255,255,255,.3)',
        activeDotColor: '#fff',
        rightTextColor: '#fff',
        leftTextColor: '#fff',
        pageArray: [],
        onSlideChange: () => {
        },
        onPageScroll: () => {
        },
        onSkipBtnClick: () => {
        },
        onDoneBtnClick: () => {
        },
        onNextBtnClick: () => {
        },
        doneBtnLabel: 'Done',
        skipBtnLabel: 'Skip',
        nextBtnLabel: '›',
        defaultIndex: 0,
        scrollEnabled: true,
        showSkipButton: true,
        showDoneButton: true,
        showDots: true,
        width: windowsWidth,
        height: windowsHeight,
        flexContainer: 1,
        useNativeDriver: true,
        showPaginationTop: false
    };

    constructor(props) {
        super(props);
        this.styles = StyleSheet.create(assign({}, defaulStyles, props.customStyles));
        this.state = {
            curPosition: props.defaultIndex,
            parallax: new Animated.Value(0),
            otherParallax: new Animated.Value(0),
        };
        this.isScrolling = false;
    }

    onNextBtnClick = () => {
        let count
        if (this.isScrolling || (count = React.Children.count(this.props.children)) < 2 || this.state.curPosition === count - 1) return;
        this.scrollView.setPage(this.state.curPosition + 1);
        this.props.onNextBtnClick(this.state.curPosition + 1);
    }

    getTransform = (index, level) => {
        const value = index === this.state.curPosition ? this.state.parallax : this.state.otherParallax;
        const leftPosition = level;
        const rightPosition = -level;
        return {
            transform: [
                {
                    translateX: value
                        .interpolate({
                            inputRange: [-1, 1],
                            outputRange: [rightPosition, leftPosition],
                        }),
                }],
        }
    }

    renderTopPagination = (index, total) => {
        let isDoneBtnShow = index === total - 1;
        let isSkipBtnShow = !isDoneBtnShow;
        let isOnlyOnePic = isDoneBtnShow && index === 0;
        return (
            <View style={[this.styles.paginationTopContainer]}>
                {this.props.showSkipButton && this.props.showPaginationTop ?
                    <View style={this.styles.viewSkip}>
                        <SkipButton
                            {...this.props}
                            {...this.state}
                            isSkipBtnShow={isSkipBtnShow}
                            styles={this.styles}
                            onSkipBtnClick={() => this.props.onSkipBtnClick(index)}
                        />
                    </View>
                    :
                    <View style={this.styles.btnContainer}/>
                }
                    <View style={this.styles.viewDots}/>
                {this.props.showDoneButton && this.props.showPaginationTop ?
                    <View style={this.styles.viewDoneButton}>
                        <DoneButton
                            {...this.props}
                            {...this.state}
                            isDoneBtnShow={isDoneBtnShow}
                            styles={this.styles}
                            isOnlyOnePic={isOnlyOnePic}
                            onNextBtnClick={this.onNextBtnClick}/>
                    </View>
                    :
                    <View style={this.styles.btnContainer}/>
                }
            </View>)
    };

    renderPagination = (index, total) => {
        let isDoneBtnShow = index === total - 1;
        let isSkipBtnShow = !isDoneBtnShow;
        let isOnlyOnePic = isDoneBtnShow && index === 0;
        return (
            <View style={[this.styles.paginationContainer]}>
                {this.props.showSkipButton && !this.props.showPaginationTop ?
                    <View style={this.styles.viewSkip}>
                        <SkipButton
                            {...this.props}
                            {...this.state}
                            isSkipBtnShow={isSkipBtnShow}
                            styles={this.styles}
                            onSkipBtnClick={() => this.props.onSkipBtnClick(index)}
                        />
                    </View>
                    :
                    <View style={this.styles.btnContainer}/>
                }
                {this.props.showDots ?
                    <View style={this.styles.viewDots}>
                        {RenderDots(index, total, {
                            ...this.props,
                            styles: this.styles
                        })}
                    </View>
                    : null}
                {this.props.showDoneButton && !this.props.showPaginationTop ?
                    <View style={this.styles.viewDoneButton}>
                        <DoneButton
                            {...this.props}
                            {...this.state}
                            isDoneBtnShow={isDoneBtnShow}
                            styles={this.styles}
                            isOnlyOnePic={isOnlyOnePic}
                            onNextBtnClick={this.onNextBtnClick}/>
                    </View>
                    :
                    <View style={this.styles.btnContainer}/>
                }
            </View>
        );
    }

    renderChild = (children, pageIndex, index) => {
        const level = children.props.level || 0;
        const transform = this.getTransform(pageIndex, level);
        const root = children.props.children;
        let nodes = children;
        if (Array.isArray(root)) {
            nodes = root.map((node, i) => this.renderChild(node, pageIndex, `${index}_${i}`));
        }
        let animatedChild = children;
        if (level !== 0) {
            animatedChild = (
                <Animated.View key={index} style={[children.props.style, transform, this.styles.hidden]}>
                    {nodes}
                </Animated.View>
            );
        } else {
            animatedChild = (
                <View key={index} style={[children.props.style, this.styles.hidden]}>
                    {nodes}
                </View>
            );
        }
        return animatedChild;
    }

    refScrollView = view => {
        this.scrollView = view;
    }

    onPageSelected = ({nativeEvent: {position}}) => {
        this.setState({curPosition: position});
        this.props.onSlideChange(position);
    };

    onPageScrollStateChanged = ({nativeEvent: {pageScrollState}}) => {
        this.isScrolling = pageScrollState !== 'idle';
    };

    // parallaxEvent = Animated.event([this.state.parallax], {useNativeDriver: true});
    // otherParallaxEvent = Animated.event([this.state.otherParallax], {useNativeDriver: true});

    onPageScroll = ({nativeEvent: {offset = 0, position = 0} = {}} = {}) => {
        const {curPosition} = this.state;
        let value, otherValue;
        if (Platform.OS === 'android') {
            if (position === curPosition) {
                value = -offset;
                otherValue = 1 - offset;
            } else {
                value = 1 - offset;
                otherValue = -offset
            }
        } else if (Platform.OS === 'ios') {
            if (offset >= 0) {
                value = -offset;
                otherValue = 1 - offset;
            } else {
                value = -offset;
                otherValue = -offset - 1;
            }
        }

        this.state.parallax.setValue(value);
        this.state.otherParallax.setValue(otherValue);
        // this.parallaxEvent(value)
        // this.otherParallaxEvent(otherValue);
        this.props.onPageScroll(offset, position)
    }

    render() {
        const childrens = this.props.children;
        const {useNativeDriver, onPageScroll} = this.props;
        const {curPosition} = this.state;
        const pages = React.Children.map(childrens, (children, i) => this.renderChild(children, i, i));
        const count = React.Children.count(childrens);

        return (
            <View style={{
                flex: this.props.flexContainer,
                height: this.props.height,
                width: this.props.width,
            }}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.2)'}/>
                <PagerView
                    ref={this.refScrollView}
                    loop={false}
                    style={this.styles.viewPager}
                    initialPage={this.props.defaultIndex}
                    scrollEnabled={this.props.scrollEnabled}
                    onPageSelected={this.onPageSelected}
                    onPageScrollStateChanged={this.onPageScrollStateChanged}
                    onPageScroll={this.onPageScroll}
                >
                    {pages}
                </PagerView>
                {this.renderPagination(curPosition, count)}
                {this.props.showPaginationTop && this.renderTopPagination(curPosition, count)}
            </View>
        );
    }
}
