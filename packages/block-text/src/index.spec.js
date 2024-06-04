import React from 'react';
import { render } from '@testing-library/react';
import { Text } from '.';
describe('block-text', () => {
    it('renders with default values', () => {
        expect(render(React.createElement(Text, null)).asFragment()).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.spec.js.map