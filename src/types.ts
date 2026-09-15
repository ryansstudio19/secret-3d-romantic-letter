export type AppStage = 
  | 'intro'            // "Someone left something here for you..."
  | 'secret_prompt'    // "Shhh... this is only for you."
  | 'envelope_3d'      // 3D floating envelope scene
  | 'envelope_opening' // 3D animation opening
  | 'letter_viewer'    // 5-page letter reader
  | 'ending';          // Final emotional scene

export interface LetterPage {
  id: number;
  pageNumber: number | null;
  paragraphs?: string[];
  bullets?: string[];
  footerNote?: string;
  decorations: {
    topRightHeliconia?: boolean;
    bottomLeftBouquet?: boolean;
    bottomRightEnvelopeWaxSeal?: boolean;
    bottomFlourish?: boolean;
    bottomRoseHeartVine?: boolean;
  };
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
}
