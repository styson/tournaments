import { Box } from './Box';
import styled from 'styled-components';

const MatchBox = styled(Box)`
  padding: 6px 10px;
  margin-bottom: 10px;
  background-color: ${props => props.index % 2 ? 'rgba(0, 0, 70, 0.07)' : 'white' };
`;

const MatchPlayer = styled.span`
  line-height: 12px;
  font-weight: 600;
  color: ${props => props.textColor || 'black'};
`;

export {
  MatchBox,
  MatchPlayer,
}