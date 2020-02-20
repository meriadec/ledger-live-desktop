// @flow

import React from "react";

const EyeOff = ({ size = 16, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      d="M7.93714155,2.25 C9.68406537,2.25 11.2768445,2.77152728 12.7050885,3.80223132 L11.6298024,4.87641394 C10.5046582,4.12161507 9.27697005,3.75 7.93714155,3.75 C5.69615794,3.75 3.76953976,4.78940205 2.11114745,6.92207507 C1.65150909,7.51316457 1.62086633,8.32718088 2.01411663,8.94152306 L2.10487085,9.06995757 L2.31525147,9.33319631 C3.13219679,10.3265113 4.01259603,11.0621444 4.96223773,11.5461668 L3.85887654,12.6482431 C2.97339702,12.1281378 2.14597555,11.425044 1.37902951,10.5414208 L1.15911395,10.2810859 L0.935939917,10.001851 C0.021352952,8.8257016 0.0213534043,7.17428908 0.935941014,5.99814018 C2.86504406,3.51733636 5.21415744,2.25 7.93714155,2.25 Z M7.93714155,5.25 C8.84010511,5.25 9.64086447,5.68999501 10.1389267,6.36838941 L9.05505896,7.45256598 C8.85320083,7.03658147 8.42845547,6.75 7.93714155,6.75 C7.25056184,6.75 6.69397902,7.30964406 6.69397902,8 C6.69397902,8.4916411 6.97625897,8.91698956 7.38674397,9.12112307 L6.30272353,10.2051379 C5.63470369,9.70373673 5.20218399,8.90265637 5.20218399,8 C5.20218399,6.48121694 6.4266662,5.25 7.93714155,5.25 Z"
      fill={color}
      fillRule="nonzero"
    />
    <path
      d="M14.8017905,5.82587446 L15.0120889,6.09392839 L15.2245729,6.37931845 C15.9251426,7.34496039 15.9251423,8.65504801 15.2245721,9.62068962 C13.2427684,12.3523393 10.7977661,13.75 7.93714155,13.75 C7.35180402,13.75 6.78364192,13.6914075 6.23308109,13.5746556 L7.56703929,12.2403978 C7.68943795,12.2468023 7.8128025,12.25 7.93714155,12.25 C10.2931542,12.25 12.3047066,11.1001165 14.0193746,8.73667768 C14.3088658,8.33765294 14.3351834,7.80923474 14.1025071,7.39237023 L14.0249386,7.27089843 L13.823795,7.0007303 C13.6738211,6.80465409 13.5216361,6.61759788 13.3672065,6.43952116 L14.425989,5.37982048 C14.552901,5.52361158 14.6781715,5.67230018 14.8017905,5.82587446 Z"
      fill={color}
      fillRule="nonzero"
    />
    <path
      d="M14.4696699,0.469669914 C14.7625631,0.176776695 15.2374369,0.176776695 15.5303301,0.469669914 C15.7965966,0.735936477 15.8208027,1.15260016 15.6029482,1.44621165 L15.5303301,1.53033009 L1.53033009,15.5303301 C1.23743687,15.8232233 0.762563133,15.8232233 0.469669914,15.5303301 C0.203403352,15.2640635 0.1791973,14.8473998 0.397051761,14.5537883 L0.469669914,14.4696699 L14.4696699,0.469669914 Z"
      fill={color}
      fillRule="nonzero"
    />
  </svg>
);

export default EyeOff;
