import React, { useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const value = new Animated.Value(1);

export const SkipButton = ({
                               styles, onSkipBtnClick, isSkipBtnShow,
                               leftTextColor,
                               skipBtnLabel, useNativeDriver
                           }) => {
    const [skipFadeOpacity] = useState(value);
    Animated.timing(
        skipFadeOpacity, {toValue: isSkipBtnShow ? 1 : 0, useNativeDriver}
    ).start();
    return (
        <View style={styles.btnSkipContainer}>
            <Animated.View style={[{
                opacity: skipFadeOpacity,
                transform: [{
                    translateX: skipFadeOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-15, 0],
                    }),
                }],
            }]}
            >
                <TouchableOpacity
                    style={styles.full}
                    onPress={isSkipBtnShow ? () => onSkipBtnClick() : null}>
                    <Text style={[styles.controllText, {color: leftTextColor}]}>
                        {skipBtnLabel}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default SkipButton
