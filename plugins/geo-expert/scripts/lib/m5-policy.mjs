export const M5_FORMAL_SAMPLE_COUNT = 2;
export const M5_SOURCE_CLASSIFICATION_THRESHOLD = 100;
export const M5_PRIMARY_LANGUAGE = 'en-US';

export function expectedFormalOrdinals(count = M5_FORMAL_SAMPLE_COUNT) {
  return Array.from({ length: count }, (_value, index) => index + 1);
}

export function sourceClassificationQueueStatus(sourceCount) {
  return sourceCount >= M5_SOURCE_CLASSIFICATION_THRESHOLD
    ? 'batch_ready'
    : 'archived_unclassified';
}
