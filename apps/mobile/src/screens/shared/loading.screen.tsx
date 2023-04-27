import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';

const LoadingScreen = () => {
  return (
    <LayoutComponent hideBack style=" justify-center items-center h-full bg-teal-300">
      <Title style="text-white font-manrope-bold">Loading...</Title>
    </LayoutComponent>
  );
};

export default LoadingScreen;
