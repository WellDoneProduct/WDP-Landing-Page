// Display titles without sentence-ending full stops; preserve decimals and body copy.
export const titleText = (text: string) => text.replace(/[.。]+(?=\s*$)/u, '');
