import { Star } from 'lucide-react';

/**
 * StarRating component to display star ratings
 * @param {number} rating - Rating value (1.0 to 5.0)
 * @param {number} size - Size of stars in pixels (default: 16)
 * @param {boolean} showValue - Whether to show numeric value (default: true)
 */
function StarRating({ rating, size = 16, showValue = true }) {
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {/* Full stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Star
                    key={`full-${i}`}
                    size={size}
                    fill="#fbbf24"
                    color="#fbbf24"
                />
            ))}

            {/* Half star */}
            {hasHalfStar && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Star size={size} color="#fbbf24" fill="none" />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '50%',
                        overflow: 'hidden'
                    }}>
                        <Star size={size} fill="#fbbf24" color="#fbbf24" />
                    </div>
                </div>
            )}

            {/* Empty stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    size={size}
                    fill="none"
                    color="rgba(255, 255, 255, 0.3)"
                />
            ))}

            {/* Numeric value */}
            {showValue && (
                <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#fbbf24',
                    marginLeft: '0.25rem'
                }}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}

export default StarRating;
