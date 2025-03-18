
/**
 * Airtable Schema Guide
 * 
 * This file contains the recommended schema for setting up your Airtable base to work with this application.
 * 
 * Base Name: Portfolio Website
 * 
 * Tables and Fields:
 * 
 * 1. Hero (Single record)
 *    - title (Single line text)
 *    - subtitle (Long text)
 * 
 * 2. Portfolio (Multiple records)
 *    - title (Single line text)
 *    - description (Long text)
 *    - image (URL)
 *    - tags (Long text - comma separated values)
 *    - link (URL, optional)
 *    - github (URL, optional)
 * 
 * 3. Career (Multiple records)
 *    - title (Single line text)
 *    - company (Single line text)
 *    - location (Single line text)
 *    - period (Single line text)
 *    - description (Long text)
 *    - type (Single select: work, education, achievement)
 * 
 * 4. Contact (Single record)
 *    - email (Email)
 *    - phone (Phone)
 *    - location (Single line text)
 * 
 * 5. Skills (Multiple records)
 *    - name (Single line text)
 *    - category (Single select: web, api, software, network, data, other)
 *    - logoSvg (Long text - contains SVG code)
 * 
 * Setup Instructions:
 * 
 * 1. Create a new Airtable base named "Portfolio Website"
 * 2. Create the tables and fields listed above
 * 3. Add at least one record to each table
 * 4. Create a Personal Access Token in Airtable (https://airtable.com/create/tokens)
 *    - Set the correct permissions (data.records:read, data.records:write) 
 * 5. Find your base ID in the API documentation (it starts with "app")
 * 6. Enter your API key and base ID in the application settings
 */

export const AIRTABLE_SCHEMA = {
  BASE_NAME: "Portfolio Website",
  TABLES: {
    HERO: {
      NAME: "Hero",
      FIELDS: {
        TITLE: "title",
        SUBTITLE: "subtitle"
      }
    },
    PORTFOLIO: {
      NAME: "Portfolio",
      FIELDS: {
        TITLE: "title",
        DESCRIPTION: "description",
        IMAGE: "image",
        TAGS: "tags",
        LINK: "link",
        GITHUB: "github"
      }
    },
    CAREER: {
      NAME: "Career",
      FIELDS: {
        TITLE: "title",
        COMPANY: "company",
        LOCATION: "location",
        PERIOD: "period",
        DESCRIPTION: "description",
        TYPE: "type"
      }
    },
    CONTACT: {
      NAME: "Contact",
      FIELDS: {
        EMAIL: "email",
        PHONE: "phone",
        LOCATION: "location"
      }
    },
    SKILLS: {
      NAME: "Skills",
      FIELDS: {
        NAME: "name",
        CATEGORY: "category",
        LOGO_SVG: "logoSvg"
      }
    }
  }
};

export default AIRTABLE_SCHEMA;
