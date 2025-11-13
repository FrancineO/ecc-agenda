"use client";

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface Room {
  id: string;
  name: string;
  description: string;
  mapLink?: string;
}

interface RoomMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export default function RoomMapModal({ isOpen, onClose, room }: RoomMapModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !room) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {room.name}
          </h2>
          <button 
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="room-info">
            <p className="room-description">{room.description}</p>
          </div>
          
          <div className="map-container">
            {room.mapLink ? (
              <Image 
                src={room.mapLink} 
                alt={`Map showing location of ${room.name}`}
                className="room-map-image"
                width={600}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div className="map-placeholder">
                <p>📍 Map not available for this location</p>
                <p className="map-placeholder-text">
                  Please refer to venue signage or ask staff for directions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          width: 600px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          position: relative;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .modal-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
        }
        
        .modal-close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }
        
        .modal-close-button:hover {
          background-color: #f3f4f6;
          color: #111827;
        }
        
        .modal-body {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(90vh - 120px);
        }
        
        .room-info {
          margin-bottom: 20px;
        }
        
        .room-description {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }
        
        .map-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .room-map-image {
          width: 100%;
          height: auto;
          display: block;
          max-height: 500px;
          object-fit: contain;
        }
        
        .map-placeholder {
          padding: 60px 20px;
          text-align: center;
          background-color: #f9fafb;
          color: #6b7280;
        }
        
        .map-placeholder p:first-child {
          font-size: 1.25rem;
          margin-bottom: 12px;
          color: #374151;
        }
        
        .map-placeholder-text {
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            width: 95vw;
            margin: 0;
          }
          
          .modal-header {
            padding: 16px 16px 12px 16px;
          }
          
          .modal-title {
            font-size: 1.25rem;
          }
          
          .modal-body {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );

  // Render modal using portal to ensure it appears above everything else
  return typeof window !== 'undefined' ? 
    createPortal(modalContent, document.body) : null;
}