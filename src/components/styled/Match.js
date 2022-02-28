import { Box } from './Box';
import styled from 'styled-components';

const MatchBox = styled(Box)`
  padding: 14px 0 0 10px;
  margin-bottom: 10px;
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