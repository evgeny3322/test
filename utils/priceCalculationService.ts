import { Addon, Segment } from '@/types/tours';

/**
 * Service to centralize all price calculation logic
 */
export const PriceCalculationService = {
  /**
   * Calculate price for a single addon
   */
  calculateAddonPrice(
    addon: Addon,
    participants: number,
    segment: Segment | undefined,
    driverHourlyRate: number
  ): number {
    if (!addon || !addon.price || !Array.isArray(addon.price)) {
      console.warn(`[Price] Invalid price data for addon: ${addon?.name || 'Unknown addon'}`);
      return 0;
    }

    if (participants > addon.max_participants) {
      console.warn(`[Price] Group size (${participants}) exceeds max for addon: ${addon.name}`);
      return 0;
    }

    console.log(`\n[Price] --- Calculating addon: "${addon.name}" ---`);

    // Get the base price per participant from the price array
    const priceIndex = participants - 1;
    const baseCost = addon.price[priceIndex] ?? addon.price[addon.price.length - 1] ?? 0;
    const basePrice = baseCost * participants;

    console.log(`[Price] → Price from backend (per participant): ${baseCost} EUR`);
    console.log(`[Price] → Group size: ${participants}`);
    console.log(`[Price] → Base total: ${basePrice.toFixed(2)} EUR`);

    if (!segment) {
      console.warn(`[Price] → Segment not found for addon "${addon.name}", using base price only.`);
      return this.roundPrice(basePrice);
    }

    // Calculate extra cost for additional time
    const addonDuration: number = Number(addon.duration) || 0;
    const segmentDuration: number = Number(segment.duration ?? 60);
    const additionalTime: number = addonDuration - segmentDuration;

    if (additionalTime > 0) {
      const additionalHours: number = additionalTime / 60;
      const extraCost: number = additionalHours * driverHourlyRate;

      console.log(`[Price] → Addon duration: ${addonDuration} min`);
      console.log(`[Price] → Segment base duration: ${segmentDuration} min`);
      console.log(
        `[Price] → Additional time: ${additionalTime} min (${additionalHours.toFixed(2)}h)`
      );
      console.log(`[Price] → Driver hourly rate: ${driverHourlyRate.toFixed(2)} EUR`);
      console.log(`[Price] → Extra cost for overtime: ${extraCost.toFixed(2)} EUR`);
      console.log(`[Price] → Final total price: ${(basePrice + extraCost).toFixed(2)} EUR`);

      return this.roundPrice(basePrice + extraCost);
    }

    console.log(`[Price] → No additional time. Final price: ${basePrice.toFixed(2)} EUR`);
    return this.roundPrice(basePrice);
  },

  /**
   * Calculate driver hourly rate based on selected transportation
   */
  calculateDriverHourlyRate(
    selectedAddons: { [key: number]: Addon },
    baseTourDuration: number,
    hourDiscount: number = 0
  ): number {
    const transportAddon = Object.values(selectedAddons).find(
      (a) => a.segmentType === 'Transportation'
    );

    if (!transportAddon) {
      return 0;
    }

    // Calculate price for the transport addon
    const participants = 1; // Use 1 for rate calculation to avoid circular dependency
    const transportPrice = transportAddon.price[0] || 0;
    const baseTourHours = baseTourDuration / 60;

    return baseTourHours > 0 ? transportPrice / baseTourHours - hourDiscount : 0;
  },

  /**
   * Calculate total price for all selected addons
   */
  calculateTotalPrice(
    selectedAddons: { [key: number]: Addon },
    segments: Segment[],
    participants: number,
    driverHourlyRate: number
  ): number {
    let total = 0;

    for (const [segmentId, addon] of Object.entries(selectedAddons)) {
      const segment = segments.find((s) => s.id === Number(segmentId));
      const addonPrice = this.calculateAddonPrice(addon, participants, segment, driverHourlyRate);

      console.log(`[Total] Addon ${addon.name}: ${addonPrice.toFixed(2)} EUR`);
      total += addonPrice;
    }

    console.log(`[Total] Final total price: ${total.toFixed(2)} EUR`);
    return this.roundPrice(total);
  },

  /**
   * Calculate price per participant
   */
  calculatePricePerParticipant(totalPrice: number, participants: number): number {
    if (participants <= 0) return 0;
    return this.roundPrice(totalPrice / participants);
  },

  /**
   * Calculate total duration in hours
   */
  calculateTotalDuration(
    baseDurationMinutes: number,
    selectedAddons: { [key: number]: Addon },
    segments: Segment[]
  ): number {
    let additionalMinutes = 0;

    console.log(`\n[Duration] --- Calculating total tour duration ---`);
    console.log(`[Duration] Base tour duration: ${baseDurationMinutes} min`);

    for (const [segmentId, addon] of Object.entries(selectedAddons)) {
      const segment = segments.find((s) => s.id === Number(segmentId));

      if (!segment) {
        console.warn(`[Duration] → Segment not found for addon key: ${segmentId}`);
        continue;
      }

      const addonDurationMinutes = Number(addon.duration) || 0;
      const segmentDurationMinutes = Number(segment.duration ?? 60);

      console.log(`\n[Duration] Segment ${segmentId} → "${addon.name}"`);
      console.log(`[Duration] → Segment base duration: ${segmentDurationMinutes} min`);
      console.log(`[Duration] → Addon duration: ${addonDurationMinutes} min`);

      if (addonDurationMinutes > segmentDurationMinutes) {
        const extraTime = addonDurationMinutes - segmentDurationMinutes;
        additionalMinutes += extraTime;
        console.log(`[Duration] → Additional time added: ${extraTime} min`);
      } else {
        console.log(`[Duration] → No additional time needed.`);
      }
    }

    const totalMinutes = baseDurationMinutes + additionalMinutes;
    const totalHours = totalMinutes / 60;

    console.log(`\n[Duration] Total tour time: ${totalMinutes} min (${totalHours.toFixed(2)} h)`);

    return parseFloat(totalHours.toFixed(2));
  },

  /**
   * Format duration for display
   */
  formatDuration(minutes: number): string {
    if (!minutes) return '0 Min';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} Hrs` : ''} ${mins > 0 ? `${mins} Min` : ''}`.trim();
  },

  /**
   * Format total duration for display (e.g., "2h 30m")
   */
  formatTotalDuration(durationInHours: number): string {
    const hours = Math.floor(durationInHours);
    const minutes = Math.round((durationInHours - hours) * 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(' ') || '0m';
  },

  /**
   * Rounds price to 2 decimal places to avoid floating point issues
   */
  roundPrice(price: number): number {
    return parseFloat((Math.round(price * 100) / 100).toFixed(2));
  },

  /**
   * Format price for display with 2 decimal places
   */
  formatPrice(price: number): string {
    return this.roundPrice(price).toFixed(2);
  },

  // Добавьте эти методы в класс PriceCalculationService

  /**
   * Rounds price to an integer value for API requests
   * This is necessary because the backend expects integer values
   */
  toInteger(price: number): number {
    return Math.round(price);
  },

  /**
   * Calculate total price for all selected addons and return as integer
   * Use this method when preparing data for API requests
   */
  calculateTotalPriceAsInteger(
    selectedAddons: { [key: number]: Addon },
    segments: Segment[],
    participants: number,
    driverHourlyRate: number
  ): number {
    const floatPrice = this.calculateTotalPrice(
      selectedAddons,
      segments,
      participants,
      driverHourlyRate
    );

    return Math.round(floatPrice);
  },

  /**
   * Converts a float price (e.g. 120.50) to integer representation
   * while preserving cents - for APIs that need integer cents
   */
  toCents(price: number): number {
    return Math.round(price * 100);
  },
};
