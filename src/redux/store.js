import { configureStore } from "@reduxjs/toolkit";
import aboutReducer from "./about/aboutSlice.js";
import expertiseReducer from "./expertise/expertiseSlice.js";
import processReducer from "./process/processSlice.js";
import servicesReducer from "./services/servicesSlice.js";
import caseStudyReducer from "./caseStudy/caseStudySlice.js";
import faqReducer from "./faq/faqSlice.js";
import heroLeftReducer from "./heroLeft/heroLeftSlice.js";

export const store = configureStore({
  reducer: {
    about: aboutReducer,
    expertise: expertiseReducer,
    process: processReducer,
    services: servicesReducer,
    caseStudy: caseStudyReducer,
    faq: faqReducer,
    heroLeft: heroLeftReducer,
  },
});
