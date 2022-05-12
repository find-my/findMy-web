import React from 'react';

import { storiesOf } from '@storybook/react';
import UploadButton from '@components/UploadButton';

const stories = storiesOf('Button', module);

stories.add('UploadButton', () => <UploadButton isCompleted={true} />);
