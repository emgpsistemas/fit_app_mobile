import { CaretDown } from 'phosphor-react-native';
import { ElementType, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from 'tailwindcss/colors';
import { toggleAnimations } from '../../animations/ToggleAnimations';

interface AccordionRootProps {
  children: React.ReactNode;
  title: string;
  isInitiallyOpen?: boolean;
  trashComponent: ElementType;
}

function AccordionRootWithTrash({
  children,
  title,
  isInitiallyOpen,
  trashComponent: TrashComponent,
}: AccordionRootProps) {
  const [showContent, setShowContent] = useState(isInitiallyOpen ?? false);
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimations);
    setShowContent(!showContent);
  };

  const arrowRotation = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className="flex flex-row overflow-hidden rounded-lg bg-zinc-100">
      <TrashComponent />
      <View className="flex flex-1 flex-col p-6">
        <TouchableOpacity
          onPress={() => toggleListItem()}
          activeOpacity={0.7}
          className="flex flex-row justify-between"
        >
          <Text className="font-openBold text-base text-zinc-900">
            {title.toLocaleUpperCase()}
          </Text>

          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <CaretDown size={24} color={colors.zinc[900]} weight="bold" />
          </Animated.View>
        </TouchableOpacity>
        {showContent ? children : null}
      </View>
    </View>
  );
}

export default AccordionRootWithTrash;
