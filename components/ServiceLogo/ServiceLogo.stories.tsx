import ServiceLogo, { Props } from '.';
import { Story } from '@storybook/react';
export default {
  component: ServiceLogo,
  title: 'Component/ServiceLogo',
};

const Template: Story<Props> = (args: Props) => <ServiceLogo {...args} />;

export const Default = Template.bind({});

Default.args = {
  textSize: 'text-4xl',
};

export const Large = Template.bind({});

Large.args = {
  textSize: 'text-5xl',
};
