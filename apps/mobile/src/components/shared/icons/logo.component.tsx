import React from 'react';
import { G, Path, Svg } from 'react-native-svg';
import { View } from 'utils/wrappers/styled-react-native';

type Props = {
  style: string;
  stroke: string;
};

function LogoIcon({ style, stroke = '#000' }: Props) {
  return (
    <View className={style + ' pb-3 pl-3 pr-1.5 pt-1.5 '}>
      <Svg width="48" height="48" fill="none" viewBox="0 0 18 14">
        <Path
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth="1.19"
          d="M3.633 6.962a3.863 3.863 0 01.088-2.105A3.914 3.914 0 016.825 2.22a3.892 3.892 0 012.098.25 3.856 3.856 0 011.651 1.307c.418.58.323.673.323.673"></Path>
        <Path
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth="1.19"
          d="M10.133 4.705c.933-.425 2.151-.38 2.842-.18a3.915 3.915 0 012.752 3.002 3.86 3.86 0 01-.175 2.1"></Path>
        <G filter="url(#filter0_d_503_17)">
          <Path
            stroke={stroke}
            strokeLinecap="round"
            strokeWidth="1.19"
            d="M1.92 7.804a3.097 3.097 0 013.21-.595"></Path>
        </G>
        <Path
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth="1.19"
          d="M5.062 13.094a3.097 3.097 0 01-3.196-.67 3.164 3.164 0 01.054-4.62 3.097 3.097 0 013.21-.595 3.12 3.12 0 011.356 1.027"></Path>
        <Path
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.19"
          d="M7.623 13.082c.137-.232.56-.694 1.15-.694.74 0 .411.347 1.315.173.904-.173.74-.694 1.643-1.04.904-.348.575.346 1.315.173.591-.14 1.122-.52 1.314-.694"></Path>
      </Svg>
    </View>
  );
}

export default LogoIcon;
