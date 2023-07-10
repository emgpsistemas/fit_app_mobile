import { useNavigation } from '@react-navigation/native';
import { Barbell, ListPlus, UserCircle } from 'phosphor-react-native';
import { ScrollView, Text, View } from 'react-native';
import HomeImageSVG from '../assets/images/svg/home.svg';
import { FitButton } from '../components/FitButton';
import { LogoutButton } from '../components/LogoutButton';

export default function Home() {
  const user = 'Fulano';
  const { navigate } = useNavigation();

  return (
    <ScrollView className="flex flex-1 flex-col px-5 py-10">
      <View className="w-24 self-end ">
        <LogoutButton />
      </View>
      <View className="mb-10 mt-4">
        <HomeImageSVG width={'100%'} />
      </View>

      <Text className="font-openBold text-2xl text-zinc-900">
        Olá {user}, bem vindo!
      </Text>
      <View className="mt-10 space-y-3">
        <FitButton.Root variant="primary" onPress={() => navigate('Exercises')}>
          <FitButton.Icon icon={ListPlus} />
          <FitButton.Text content="Exercícios" />
        </FitButton.Root>

        <FitButton.Root variant="primary" onPress={() => navigate('Profile')}>
          <FitButton.Icon icon={UserCircle} />
          <FitButton.Text content="Perfil" />
        </FitButton.Root>

        <FitButton.Root variant="primary" onPress={() => navigate('Trainings')}>
          <FitButton.Icon icon={Barbell} />
          <FitButton.Text content="Treinos" />
        </FitButton.Root>
      </View>
    </ScrollView>
  );
}
