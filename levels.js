var levels =[
  '1111111111111111111110001111111111000011111010111010111110101011111111100010111111111110001111111111111111111111',
  '1111111111111110111101111111101111011111111011110011111110111111111111101111111100111011111111001111111111111111',
  '1111111111111100000111111111111001111101111111111110001110111111111111101111111111111001111111111111111111111111',
  '1111111111111111111111111111111100000101111111001001011011110010000110111111111111101111111111111011111111111111',
  '1111110111111111111101111111111111011111111111110111111111111111111111111010111110111110000111000111100011111111',
  '1111111111100111111111111001111110001111111111101000001111111010111111110111111111111101111111111111001111111111',
  '1111110111111111111101111111111111001111111111111110111111111111101101111101111001011110001111110111111111111101',
  '1111111111111111111111111111111111000011111111110000010111111100000101111111111100011111111111111111111111111111',
  '1111111111111100010001111111111101011111110000010111111111111111111101111111111111011111111111110011111111111111',
  '1111111101111111010111011111110101110011111100011111000111111111110001111111111101111111111111011111111111111111',
  '1110111111111111000111111111111111111111011111111111110111111111111101000111111111010001111111111100011111111111',
  '1111000111111111110101111111111101001111111111110001011111111101010111111111000001111111111111111111111111111111',
  '1111110101111111111101011111111111000100011100011111000011010111110000110101111110101111111111111111111111111111',
  '1111111111111111000111111111110100001111111101001011111111110010111111110100111111111101111111111111001111111111',
  '1111111111111111111111111111111111111000111111111000001110011111101011100111111011111111111100011111111111111111',
  '1110111111111111101111111111101001111111110110011111111101010011111111010111111111111111111111111111111111111111',
  '1111111111111111110111111111111101111111111111010111111111010101111111100000011111111111001111111111111111111111',
  '1111111111111110001111111111100001010111111000000101111111111100011111111111111111111111111111111111111111111111',
  '1111111110111111111111101111011111111001110111111111111100111111111111111111111111111000011111011111111111100011',
  '1111100111111111110000111111111111000111111111111011111111111110111111111111101111111111111111111111111111111111',
  '1000000111111111111011111111111110111101111111101110001111111111111111111111111111111111111111111111111111111111',
  '1111111111000011111111110111111111000000111110111111111111000111111111111111111111111111111111111111111111111111',
  '1111111111111101111111110101011011111101010010111111000111101111111111111011110111111111111000111111111111111111',
  '1111111111111111111111111011100111111100011001111111101111111111111001111100001111111111111111111111111111111111',
  '1110011111111111100111111111111110110001111111100001011111111000010111111110111111111111111111111111111111111111',
  '1100011001011111010110000011110100001111111111111111111111111111111111111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111111111111111111110001000011111100011101111111010111001111111111111111',
  '1111111111111111111111111111111111111110111111111101101011111110001000111000011111101111111111111011111111111111',
  '1111100111111111111001100001111111111111111111011111111111110110011111111100100111111111111111111111111111111111',
  '1110111111111111001010111110110000101111101101100011111011011111111110111111111111111111111111111111111111111111',
  '1111011111111111110011111111111100111111111111100101111111111110001111111111111101011111111111010111111111110001',
  '1101011111000110000111110101100001111101011010111111111111111111111111111100111111111111001111111111111111111111',
  '1011111000011100111111011111111110110111111111101101111111111011011111111110111111111111111111111111111111111111',
  '1111111111111111111111111111111111111000110000011110101101000111101011010111111111111111111111111111000011111111',
  '1111111110000111111001111111111110011111111111111111011111111111110111111111111101111111100001011111111111111111',
  '1111111111100111110101111001111101011110111111000001101111111110011001111111111111111111111111111111111111111111',
  '1111001111111111110011111111111100111110111111001111101111111111111001111111111000011111111111111111111111111111',
  '1111111111111111111111111111111111111111111111111110111111110011101111110000111011111100100110111111111111111111',
  '1110101111111111101011111111111000110111111100110101111111001101011111111111000111111111111111111111111111111111',
  '1111101111111111100011111111111010111111111110101111111100001011111111111110111111111111111111111111111111111111',
  '1100011111111111000011111111110000111111111100001111111111001111111111111111111111111111111111111111111110000111',
  '1111111111111110000001111111101001011110011010010111100111111111111001111111111110011111111111111111111111111111',
  '1111111111111111111111111111111100011011111111010110111111110100100111111111000111011111111111110111111111111100',
  '1111111111111111111111111111111110000110111111111111100111111100001001111111111111111111111111111111111111111111',
  '1111101111111111111011111111111110111000011111101111111111111111111111111101110011111110001100111111111111111111',
  '1111111111111111111110001111111101001011111011010010111110110001111111101101011111111011000111111111111111111111',
  '1111111011111101111000111111011110001111110111111011111101110111111111111101111111111111011111111111110111111111',
  '1111111111111111111111111111111011111111111100011010111111000110000111110101101111111101011011111111111111111111',
  '1111111111111111111111111111111011111111111100010111111111010101111111110000011111011111111111100011111111111111',
  '1111111111111101101111111110010001111101100011111111011011111111110010111111111111111111111111111111111111111111',
  '1111010000111111110111101011111100111010111111111110001111111111111111111111110111111111111101111111111111001111',
  '1000111111111110001011111111100010111111111101101111111111011001111111111111011111111111110111111111111101111111',
  '1111111101111110000110001111111110101111111111101011111111111000111111111111111111111111111011111111111100011111',
  '1111111111111011111111111110111111111111101111111111111011111100001011111111001110111111111111100111111111111111',
  '1111111111111111110101111111111101011111111111000011111111110100011111111100011111111111111111111111111111111111',
  '1111111101111111111111011001111111110000011111111100011111111111111111111111001111111111110011111111111111111111',
  '1111111111101111111111110001111111111111111111111011111111111110101111111111100001111111111111111111111110000111',
  '1111111111010111111111110001100011111100011010111111101110101111111011111111111111111111111111111111111111111111',
  '1111000111111111110101111111111101011111111111010100111111110101001111111100001111111111110001111111111111111111',
  '1111111011011111111110100011111111100111111111101111100111111011111001111110011111111111111111111111111111111111',
  '1111111111111100011111111111010111111111110101100111111111111001111110111111111111101111011111111011100011111110',
  '1111111111111111000111111111110101111111111101011111111111100011010111111000110101111110001100011111111111111111',
  '1111111111111111101011111111111010110101111110001101011111111111000111101110101111110001101011111111111000111111',
  '1111111111111111111111111111111100001111111111111111111111010000111111110100000111111100011111111111111111111111',
  '1111111111110100001111111000111111111111110011111111111100111111111111111111111111111111110011111111111100111111',
  '1111111110110111111111000101111111111111011111010111110111110101111111111100011111111111111110011111111111100111',
  '1111111110111111101111101111110001011011111111110110111111111101111111111111011111111111110011111111111100111111',
  '1111110101111111111101011111111111000111111111110010011111111111100111111111111110111111111111000111111111111111',
  '1001011111111110000001111111101101011111110001010111111111111111111111111111111111111111111111111111111111111111',
  '1111111111111111111011111110010100011111100101111111111000011111111110111111110101111111111101011111111111000111',
  '1111111111000111111111110101111111111001011010111100011110101111111111100011111111111111111111111111111100001111',
  '1111111101111111111111011111111111110011111111111011111111111110111111111111100011111111111000000111111111111111',
  '1111111111111111111111111111111111111111011100011111100111010111110000110101111110001111111111100011111111111111',
  '1111111010101111101010001011111010100010111110001111101111111111111111111111111111111111111111111111111111111111',
  '1111111111000111111111110101011010111101010110101111111100100011111111111101111111111111011111111111110011111111',
  '1101111111111110001111110111111111111101111011111111011100011110110111111111101111111111111011111111111110111111',
  '1111111010101111111110001011111111100000110001111101111101011111011111010111111111111111111111111111111111111111',
  '1111111111111111111111111111111111110001111111111001011111000000010111111111111111111111110000111111111111111111',
  '1111111111111111111111111111111100101010111111001010101111111110000001111111111111111111111111111111111111111111',
  '1111111010111111111110100011111111100000111111111101101111111111011001111111110111111111111101111111111111111111',
  '1111011111000111110111110001111100111100011111111111111111010111111111110101111111111100011111111111111111111111',
  '1111111111111111111111111111111111111011111111000100011111100000001111111000001011111110001010111111111111111111',
  '1101111111111111011111111111110011111111111101111111111111111110101111111111101011111111111000111111111111111111',
  '1111111111111111111111001011111111110010111111111110000111111111111101111111000011011111111111110111111111111111',
  '1111111111111110001111111111101011111111111010000111000111101011110101111010111101011110001111111111111111111111',
  '1000111111111101001111111111010001111111111110001111111111101011111111101010111111111010111111111110001111111111',
  '1111111111111111111111111111011111111110010111111111100101010111111101010101111111011100011111110111111111111111',
  '1111111111001111111111110011110000111111110000001111111101011111111111010111111111111111111111111111111111111111',
  '1111111111111111111101011111111111010111111111100001111111110001111111111111111111111111111111111110000111110000',
  '1111111111110100001111111101010011111111010100111111110111101111111111111111111101011111111111010111111111110001',
  '1111111101111111111111011111111111110111110111111101101101111111010011001111110100111111111100001111111111111111',
  '1111111111101111111111010001111111110101111111111100011111111111111111111111000011111111111100001111111111111111',
  '1000111111111110101011111111101010110101111111100101010111111111000101111111111111011111111111110111111111111111',
  '1100111111111111001111111111111111111111111100010111111111010101111111110000011111111111111111111111111111111111',
  '1111011111111111110111111111111101111111111111010101111111111101001011111111000000011111111111111111111111111111',
  '1111111111011111000111110111110101111101111101011111011111110110111111111101101111111111011001111111111111111111',
  '1111111111111101111111111111011101011111110101010111111100000000011111111111111111111111111111111111111111111111',
  '1111111111001111111111110011111111111111111111111111111110111111110111101110011101111001100111001111111111111111',
  '1111010111111111010101111111100000011010111111111100101111111110000011111111111111111111111111111111111111111111',
  '1111110001111111111101011111000111010011110001111110111100011111101111111111111011111111111111111111111111111111'
]
