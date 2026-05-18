'use client';

import React, { useState } from 'react';
import { Venue, DayOfWeek } from '@/lib/types';
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
  ChevronUp,
  Clock,
  Users,
  BadgeCheck,
  AlertCircle,
} from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  areaDisplayName: string;
  distanceKm?: number;
  index?: number;
}

export default function VenueCard({ venue, areaDisplayName, distanceKm, index = 0 }: VenueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const verificationStatus = getVerificationStatus(venue.verifiedDate);

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

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  // Check if venue has a deal today
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
  const hasDealsToday = venue.days.includes(today);

  return (
    <article 
      className="card card-hover p-5 sm:p-6 opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header: Name + Day badges */}
      <div className="flex flex-col gap-3">
        {/* Today badge if applicable */}
        {hasDealsToday && (
          <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage/20 text-sage text-xs font-semibold border border-sage/30">
            <Clock className="w-3 h-3" />
            Available today
          </div>
        )}
        
        {/* Venue name */}
        <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary leading-tight dark:text-pearl">
          {venue.name}
        </h3>
        
        {/* Day badges */}
        <div className="flex flex-wrap gap-1.5">
          {venue.days.map((day) => (
            <span
              key={day}
              className={`day-pill ${dayColors[day]}`}
            >
              {dayShortNames[day]}
            </span>
          ))}
        </div>
      </div>

      {/* Location & Distance badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="badge badge-location">
          <MapPin className="w-3 h-3" />
          {areaDisplayName}
        </span>
        {distanceKm !== undefined && (
          <span className="badge badge-distance">
            <Navigation className="w-3 h-3" />
            {formatDistance(distanceKm)}
          </span>
        )}
        {venue.membershipRequired && (
          <span className="badge badge-membership">
            <Users className="w-3 h-3" />
            Members
          </span>
        )}
      </div>

      {/* Deal details */}
      <p className="mt-4 text-sm text-text-secondary leading-relaxed dark:text-silver">
        {venue.details}
      </p>

      {/* Membership notice */}
      {venue.membershipRequired && venue.membershipDetails && (
        <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-accent/10 border border-accent/20">
          <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-xs text-accent-light leading-relaxed">
            {venue.membershipDetails}
          </p>
        </div>
      )}

      {/* Expandable section */}
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-light font-medium flex items-center gap-1 hover:text-primary transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Less details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              More details
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border dark:border-slate-mid/50 space-y-4 animate-scale-in">
            {/* Address */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0 dark:text-slate-light" />
              <span className="text-text-secondary dark:text-silver">{venue.address}</span>
            </div>
            
            {/* Verification status */}
            <div className="flex items-center gap-2 text-sm">
              <BadgeCheck className={`w-4 h-4 ${verificationStatus.color}`} />
              <span className={verificationStatus.color}>
                Verified {new Date(venue.verifiedDate).toLocaleDateString('en-AU', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Tags */}
            {venue.tags && venue.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {venue.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-xs font-medium text-text-tertiary bg-bg-tertiary dark:text-slate-light dark:bg-slate-mid/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Extra links */}
            {venue.extraDetails && venue.extraDetails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {venue.extraDetails.map((detail, idx) => {
                  const IconComponent = getIconForExtraDetail(detail.icon);
                  return (
                    <a
                      key={idx}
                      href={detail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary bg-bg-tertiary hover:bg-border transition-colors dark:text-silver dark:bg-slate-mid/50 dark:hover:bg-slate-mid"
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {detail.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-5 border-t border-border dark:border-slate-mid/50">
        <a
          href={venue.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1"
        >
          <Globe className="w-4 h-4" />
          Visit Website
        </a>
        
        {venue.phone.length > 0 && (
          <div className="relative flex-1">
            {venue.phone.length === 1 ? (
              <a
                href={`tel:${venue.phone[0]}`}
                className="btn btn-secondary w-full"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            ) : (
              <>
                <button
                  onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                  className="btn btn-secondary w-full"
                >
                  <Phone className="w-4 h-4" />
                  Call
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${phoneDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {phoneDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-bg-primary rounded-xl shadow-lg border border-border overflow-hidden animate-scale-in dark:bg-slate-dark dark:border-slate-mid">
                    {venue.phone.map((phoneNumber, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phoneNumber}`}
                        onClick={() => setPhoneDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-text-primary hover:bg-bg-secondary transition-colors border-b border-border last:border-0 dark:text-silver dark:hover:bg-slate-mid dark:border-slate-mid/50"
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
    </article>
  );
}
