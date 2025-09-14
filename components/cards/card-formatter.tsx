import React from 'react'

interface CardData {
  back: string
  rich_data?: {
    translation?: string
    pronunciation?: string
    wordType?: string
    examples?: Array<{text: string, translation?: string} | string>
    grammarNotes?: string
    usageNotes?: string
    mnemonicHint?: string
    culturalContext?: string
    relatedWords?: string[]
    synonyms?: string[]
    antonyms?: string[]
    conjugations?: Record<string, string>
    difficulty?: string
  }
  // Legacy fields for backward compatibility
  translation?: string
  pronunciation?: string
  wordType?: string
  examples?: Array<{text: string, translation?: string} | string>
  grammarNotes?: string
  usageNotes?: string
  mnemonicHint?: string
  culturalContext?: string
  relatedWords?: string[]
  synonyms?: string[]
  antonyms?: string[]
  conjugations?: Record<string, string>
}

interface CardFormatterProps {
  card: CardData
  className?: string
}

export function CardFormatter({ card, className = "" }: CardFormatterProps) {
  // If the card.back contains HTML (old format), render it as HTML
  if (card.back && (card.back.includes('<div') || card.back.includes('<strong>'))) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: card.back }}
      />
    )
  }

  // Get data from rich_data if available, otherwise fall back to direct properties
  const data = card.rich_data || card

  // For new JSON format, render structured components
  return (
    <div className={`card-content ${className}`}>
      {/* Main Translation */}
      {(data.translation || card.back) && (
        <div className="translation">
          <strong>Translation:</strong> {data.translation || card.back}
        </div>
      )}

      {/* Pronunciation */}
      {data.pronunciation && (
        <div className="pronunciation">
          <strong>Pronunciation:</strong> {data.pronunciation}
        </div>
      )}

      {/* Word Type */}
      {data.wordType && (
        <div className="word-type">
          <strong>Type:</strong> {data.wordType}
        </div>
      )}

      {/* Examples */}
      {data.examples && Array.isArray(data.examples) && data.examples.length > 0 && (
        <div className="examples">
          <strong>Examples:</strong>
          <ul>
            {data.examples.map((example, index) => (
              <li key={index}>
                {typeof example === 'string' 
                  ? example 
                  : `${example.text}${example.translation ? ` → ${example.translation}` : ''}`
                }
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grammar Notes */}
      {data.grammarNotes && (
        <div className="grammar">
          <strong>Grammar:</strong> {data.grammarNotes}
        </div>
      )}

      {/* Cultural Context */}
      {data.culturalContext && (
        <div className="culture">
          <strong>Cultural Note:</strong> {data.culturalContext}
        </div>
      )}

      {/* Usage Notes */}
      {data.usageNotes && (
        <div className="usage">
          <strong>Usage:</strong> {data.usageNotes}
        </div>
      )}

      {/* Memory Tip */}
      {data.mnemonicHint && (
        <div className="memory-tip">
          <strong>Memory Tip:</strong> {data.mnemonicHint}
        </div>
      )}

      {/* Related Words */}
      {data.relatedWords && Array.isArray(data.relatedWords) && data.relatedWords.length > 0 && (
        <div className="related-words">
          <strong>Related:</strong> {data.relatedWords.join(', ')}
        </div>
      )}

      {/* Synonyms */}
      {data.synonyms && Array.isArray(data.synonyms) && data.synonyms.length > 0 && (
        <div className="synonyms">
          <strong>Synonyms:</strong> {data.synonyms.join(', ')}
        </div>
      )}

      {/* Antonyms */}
      {data.antonyms && Array.isArray(data.antonyms) && data.antonyms.length > 0 && (
        <div className="antonyms">
          <strong>Antonyms:</strong> {data.antonyms.join(', ')}
        </div>
      )}

      {/* Conjugations */}
      {data.conjugations && typeof data.conjugations === 'object' && (
        <div className="conjugations">
          <strong>Conjugations:</strong>
          <ul>
            {Object.entries(data.conjugations).map(([tense, form]) => (
              <li key={tense}>
                <strong>{tense}:</strong> {form}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}