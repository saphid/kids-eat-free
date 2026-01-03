'use client';

import React from 'react';
import { Venue } from '@/lib/types';
import { dayDisplayNames, dayColors, dayShortNames } from '@/lib/constants';
import { getVerificationStatus } from '@/lib/utils';
import {
  MapPin,
  Phone,
  Globe,
  Star,
  Facebook,
  Instagram,
  ExternalLink,
  Navigation,
  ChevronDown,
} from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  areaDisplayName: string;
  distanceKm?: number;
}

export default function VenueCard({ venue, areaDisplayName, distanceKm }: VenueCardProps) {
  const verificationStatus = getVerificationStatus(venue.verifiedDate);

  const [phoneDropdownOpen, setPhoneDropdownOpen] = React.useState(false);

  const getIconForExtraDetail = (iconName?: string) => {
    switch (iconName) {
      case 'star':
        return Star;
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      default:
        return ExternalLink;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200">
      <div className="flex flex-col gap-4">
        {/* Venue Name with Day Badges */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{venue.name}</h3>
            {venue.days.map((day) => (
              <span
                key={day}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white ${dayColors[day]}`}
              >
                {dayShortNames[day]}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <MapPin className="w-3 h-3 mr-1" />
              {areaDisplayName}
            </span>
            {distanceKm !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Navigation className="w-3 h-3 mr-1" />
                {distanceKm < 1
                  ? `${Math.round(distanceKm * 1000)}m away`
                  : `${distanceKm.toFixed(1)}km away`}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">{venue.details}</p>

        {venue.membershipRequired && venue.membershipDetails && (
          <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
            {venue.membershipDetails}
          </p>
        )}

        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>Verified:</span>
            <span className={verificationStatus.color}>
              {new Date(venue.verifiedDate).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="text-gray-400">{venue.address}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Globe className="w-4 h-4 mr-2" />
            Website
          </a>
          {venue.phone.length > 0 && (
            <div className="relative">
              {venue.phone.length === 1 ? (
                <a
                  href={`tel:${venue.phone[0]}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {venue.phone[0]}
                </a>
              ) : (
                <>
                  <button
                    onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                    className="inline-flex items-center justify-between px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 min-w-[160px]"
                  >
                    <span className="inline-flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {venue.phone[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {phoneDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-full">
                      {venue.phone.slice(1).map((phoneNumber, index) => (
                        <a
                          key={index + 1}
                          href={`tel:${phoneNumber}`}
                          onClick={() => setPhoneDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                        >
                          {phoneNumber}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {venue.extraDetails && venue.extraDetails.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {venue.extraDetails.map((detail, index) => {
              const IconComponent = getIconForExtraDetail(detail.icon);
              return (
                <a
                  key={index}
                  href={detail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-200 shadow-sm text-xs font-medium rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <IconComponent className="w-3.5 h-3.5 mr-1.5" />
                  {detail.label}
                </a>
              );
            })}
          </div>
        )}

        {venue.tags && venue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {venue.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500 bg-gray-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
