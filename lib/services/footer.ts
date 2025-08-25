import { createClient } from '@/lib/supabase/client';

export interface FooterSection {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  is_external: boolean;
  sort_order: number;
}

export interface SocialMedia {
  id: string;
  platform: string;
  icon: string;
  url: string;
  color?: string;
  sort_order: number;
}

export interface ContactInfo {
  id: string;
  type: string;
  icon: string;
  label: string;
  value: string;
  href?: string;
  sort_order: number;
}

export interface CompanyInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  short_description?: string;
}

export interface NewsletterSettings {
  id: string;
  title: string;
  description?: string;
  success_message: string;
  button_text: string;
  placeholder_text: string;
}

export class FooterService {
  private supabase = createClient();

  async getFooterSections(): Promise<FooterSection[]> {
    try {
      const { data: sections, error: sectionsError } = await this.supabase
        .from('footer_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (sectionsError) {
        console.error('Error fetching footer sections:', sectionsError);
        return [];
      }

      const sectionsWithLinks = await Promise.all(
        sections.map(async (section) => {
          const { data: links, error: linksError } = await this.supabase
            .from('footer_links')
            .select('*')
            .eq('footer_section_id', section.id)
            .eq('is_active', true)
            .order('sort_order');

          if (linksError) {
            console.error('Error fetching footer links:', linksError);
            return { ...section, links: [] };
          }

          return { ...section, links: links || [] };
        })
      );

      return sectionsWithLinks;
    } catch (error) {
      console.error('Error in getFooterSections:', error);
      return [];
    }
  }

  async getSocialMedia(): Promise<SocialMedia[]> {
    try {
      const { data, error } = await this.supabase
        .from('social_media')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching social media:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSocialMedia:', error);
      return [];
    }
  }

  async getContactInfo(): Promise<ContactInfo[]> {
    try {
      const { data, error } = await this.supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching contact info:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContactInfo:', error);
      return [];
    }
  }

  async getCompanyInfo(): Promise<CompanyInfo | null> {
    try {
      const { data: company, error: companyError } = await this.supabase
        .from('companies')
        .select('*')
        .eq('slug', 'tekna')
        .eq('is_active', true)
        .single();

      if (companyError) {
        console.error('Error fetching company info:', companyError);
        return null;
      }

      // Get company translation for Indonesian
      const { data: translation, error: translationError } = await this.supabase
        .from('company_translations')
        .select(`
          description,
          short_description,
          languages!inner(code)
        `)
        .eq('company_id', company.id)
        .eq('languages.code', 'id')
        .single();

      if (translationError) {
        console.error('Error fetching company translation:', translationError);
      }

      return {
        ...company,
        description: translation?.description,
        short_description: translation?.short_description,
      };
    } catch (error) {
      console.error('Error in getCompanyInfo:', error);
      return null;
    }
  }

  async getNewsletterSettings(): Promise<NewsletterSettings | null> {
    try {
      const { data: settings, error: settingsError } = await this.supabase
        .from('newsletter_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (settingsError) {
        console.error('Error fetching newsletter settings:', settingsError);
        return null;
      }

      // Get newsletter translation for Indonesian
      const { data: translation, error: translationError } = await this.supabase
        .from('newsletter_settings_translations')
        .select(`
          title,
          description,
          success_message,
          button_text,
          placeholder_text,
          languages!inner(code)
        `)
        .eq('newsletter_settings_id', settings.id)
        .eq('languages.code', 'id')
        .single();

      if (translationError) {
        console.error('Error fetching newsletter translation:', translationError);
      }

      return {
        ...settings,
        ...(translation && {
          title: translation.title,
          description: translation.description,
          success_message: translation.success_message,
          button_text: translation.button_text,
          placeholder_text: translation.placeholder_text,
        }),
      };
    } catch (error) {
      console.error('Error in getNewsletterSettings:', error);
      return null;
    }
  }

  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('newsletter_subscriptions')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          source: 'website',
          is_active: true,
        });

      if (error) {
        console.error('Error subscribing to newsletter:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in subscribeToNewsletter:', error);
      return false;
    }
  }
}
