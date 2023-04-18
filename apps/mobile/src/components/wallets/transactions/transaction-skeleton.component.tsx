import SkeletonBar from 'components/shared/loading/skeleton-bar.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { View } from 'utils/wrappers/styled-react-native';

const TransactionSkeleton = () => {
  return (
    <View className="flex w-full flex-row items-center rounded-lg bg-slate-100 p-4">
      <View className="flex items-center justify-center rounded-lg bg-slate-900 p-4">
        <MonoIcon color="white" iconName="Loading" />
      </View>
      <View className="ml-4 flex flex-col justify-around">
        <SkeletonBar style="mb-2 w-36" />
        <SkeletonBar />
      </View>
      <View className="ml-auto">
        <SkeletonBar style="w-16" />
      </View>
    </View>
  );
};

export default TransactionSkeleton;
