import { IconStar, IconStarFilled } from "@tabler/icons-react";

interface RatingProps {
    value: number;    
    max?: number;      
    size?: number;     
}

export default function StarRatingComponent({ value, max = 5, size = 20 }: RatingProps) {
    return (
        <div className="flex items-center">
            {Array.from({ length: max }).map((_, i) => {
                const full = i + 1 <= Math.floor(value);        // Estrella llena
                const half = value - i > 0 && value - i < 1;    // Media estrella

                return (
                    <div key={i} className="relative" style={{ width: size, height: size }}>
                        {/* Estrella vacía */}
                        <IconStar size={size} className="text-contrast-secondary" />

                        {/* Estrella llena */}
                        {full && (
                            <IconStarFilled
                                size={size}
                                className="text-contrast-secondary absolute left-0 top-0"
                            />
                        )}

                        {/* Media estrella */}
                        {half && (
                            <div
                                className="absolute left-0 top-0 overflow-hidden"
                                style={{ width: `${(value - i) * 100}%`, height: size }}
                            >
                                <IconStarFilled
                                    size={size}
                                    className="text-contrast-secondary"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
