import React, { useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const value = new Animated.Value(0);

export const DoneButton = ({
                               styles, onDoneBtnClick, onNextBtnClick,
                               rightTextColor, isDoneBtnShow,
                               doneBtnLabel, nextBtnLabel,useNativeDriver
                           }) => {
    const [doneFadeOpacity] = useState(value);
    const [showDone, setShowDone] = useState(isDoneBtnShow)
    if (showDone !== isDoneBtnShow) {
        showDone && setShowDone(isDoneBtnShow)
        Animated.timing(
            doneFadeOpacity, {toValue: isDoneBtnShow ? 1 : 0, useNativeDriver}
        ).start(() => {
            setShowDone(isDoneBtnShow)
        });
    }
    return (
        <View style={styles.btnContainer}>
            <Animated.View style={[{
                opacity: doneFadeOpacity,
                transform: [{
                    translateX: doneFadeOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-15, 0],
                    }),
                }],
            }]}
            >
                <TouchableOpacity
                    style={styles.full}
                    onPress={isDoneBtnShow ? onDoneBtnClick : onNextBtnClick}
                >
                    <Text style={[styles.controllText, {
                        color: rightTextColor,
                    }]}>
                        {doneBtnLabel}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
            {showDone ? null : (
                <Animated.View style={[styles.full, StyleSheet.absoluteFill, {
                    opacity: doneFadeOpacity.interpolate({
                        inputRange: [0, 1], outputRange: [1, 0]
                    })
                }]}>
                    <TouchableOpacity
                        style={styles.full}
                        onPress={onNextBtnClick}
                    >
                        <Text style={[styles.nextButtonText, {color: rightTextColor}]}>
                            {nextBtnLabel}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    )
}

export default DoneButton
