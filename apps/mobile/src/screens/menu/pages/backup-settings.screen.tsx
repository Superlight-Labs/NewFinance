import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useState } from 'react';
import { Clipboard } from 'react-native';
import { useDeriveState } from 'state/derive.state';
import { useSnackbarState } from 'state/snackbar.state';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'utils/wrappers/styled-react-native';

const BackupSettings = () => {
  const [showSeedphrase, setShowSeedphrase] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { seed } = useDeriveState();
  const [seedPhrase] = useState<string | undefined>(seed);
  const { setMessage } = useSnackbarState();

  const copyToClipboard = () => {
    Clipboard.setString(seed ? seed : '');
    setMessage({
      level: 'info',
      message: 'Copied your phrase to clipboard!',
    });
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="px-5">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Backup
        </Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You can export your seedphrase here. But be careful - when exported, our security features
          to not take full action anymore.
        </Text>
        <ButtonComponent
          onPress={() => {
            setShowWarning(true);
          }}
          style={seedPhrase === undefined ? 'bg-[#FF0000] opacity-50 mt-4' : 'bg-[#FF0000] mt-4'}
          textStyle="text-white"
          disabled={seedPhrase === undefined}>
          Show Seedphrase
        </ButtonComponent>
        <Text className="mt-2 text-center font-manrope text-xs font-medium text-grey">
          This wallet was generated without a Seedphrase. A backup without a Seedphrase will be
          available with launch of mainnet.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
      <Modal
        visible={showWarning}
        animationType="fade"
        className="items-center justify-center opacity-20"
        presentationStyle="overFullScreen"
        transparent={true}>
        <Pressable
          onPress={() => {
            setShowWarning(false);
          }}
          className=" h-full w-full items-center justify-center bg-[#0000004F]">
          <View className="mx-5 rounded bg-white px-8 py-8">
            <View className="flex-column">
              <View className="mb-3 flex-row">
                <MonoIcon
                  iconName="AlertTriangle"
                  width={13}
                  color={'#FF0000'}
                  strokeWitdth={2.5}
                />
                <Text className="font-manrope text-sm font-medium text-grey">
                  <Text className="font-manrope text-sm font-bold text-[#FF0000]"> Carefull </Text>-
                  by showing your Seedphrase, an attacker could hijack your wallet.
                </Text>
              </View>
              <View className="flex-column mt-3">
                <View className="mb-3 flex-row">
                  <MonoIcon
                    iconName="AlertTriangle"
                    width={13}
                    color={'black'}
                    strokeWitdth={2.5}
                  />
                  <Text className="mb-1 ml-1 font-manrope text-sm font-medium text-black">
                    MPC security no longer works permanently
                  </Text>
                </View>
                <View className="mb-3 flex-row">
                  <MonoIcon
                    iconName="AlertTriangle"
                    width={13}
                    color={'black'}
                    strokeWitdth={2.5}
                  />
                  <Text className="mb-1 ml-1 font-manrope text-sm font-medium text-black">
                    Do not show anybody
                  </Text>
                </View>
                <View className="mb-3 flex-row">
                  <MonoIcon
                    iconName="AlertTriangle"
                    width={13}
                    color={'black'}
                    strokeWitdth={2.5}
                  />
                  <Text className="mb-1 ml-1 font-manrope text-sm font-medium text-black">
                    Write it down in a save place
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-5 w-full flex-row">
              <ButtonComponent
                onPress={() => {
                  setShowWarning(false);
                }}
                style="bg-[#F2F1F6] mr-2 flex-1"
                textStyle="text-black">
                Close
              </ButtonComponent>
              <ButtonComponent
                onPress={() => {
                  setShowWarning(false);
                  setShowSeedphrase(true);
                }}
                style="bg-[#FF0000] ml-2 flex-1"
                textStyle="text-white">
                Show anyway
              </ButtonComponent>
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={showSeedphrase}
        animationType="fade"
        className="items-center justify-center opacity-20"
        presentationStyle="overFullScreen"
        transparent={true}>
        <Pressable
          onPress={() => {
            setShowSeedphrase(false);
          }}
          className=" h-full w-full items-center justify-center bg-[#0000004F]">
          <View className="mx-12 rounded bg-white px-8 py-8">
            <View className="mb-6 flex-row">
              {seedPhrase === undefined && (
                <Text className="mb-1 ml-1 font-manrope text-sm font-medium text-black">
                  This wallet was generated without a seedphrase.
                </Text>
              )}
              <View className="flex-column mr-2">
                {seedPhrase
                  ?.split(' ')
                  .slice(0, 6)
                  .map((word, x) => {
                    return (
                      <View className="my-1 flex-row">
                        <Text className="mt-0.5 px-1.5 py-0.5 font-manrope-medium">{x + 1}.</Text>
                        <Text className="mt-0.5 bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium">
                          {word}
                        </Text>
                      </View>
                    );
                  })}
              </View>
              <View className="flex-column ml-2">
                {seedPhrase
                  ?.split(' ')
                  .slice(6, 12)
                  .map((word, x) => {
                    return (
                      <View className="my-1 flex-row">
                        <Text className="mt-0.5 px-1.5 py-0.5 font-manrope-medium">{x + 7}.</Text>
                        <Text className="mt-0.5 bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium">
                          {word}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>

            <View className="w-full flex-row">
              <ButtonComponent
                onPress={() => {
                  setShowSeedphrase(false);
                }}
                style="bg-[#F2F1F6] mr-2 flex-1"
                textStyle="text-black">
                Close
              </ButtonComponent>
              <ButtonComponent
                onPress={() => {
                  copyToClipboard();
                  setShowSeedphrase(false);
                }}
                style="bg-[#3385FF] ml-2 flex-1"
                textStyle="text-white">
                Copy
              </ButtonComponent>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default BackupSettings;
