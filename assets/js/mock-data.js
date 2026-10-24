/* Compatibility facade for legacy markup. It contains no business data and never
   reads or writes localStorage. Production data comes from assets/js/api.js. */
(function(){
  let role='patient';
  const identities={patient:{id:'',name:'',email:'',role:'patient'},therapist:{id:'',name:'',email:'',role:'therapist'},admin:{id:'',name:'',email:'',role:'admin'}};
  window.mindcareStore={getStore:()=>({currentUser:{...identities[role]}}),getCurrentUser:()=>({...identities[role]}),setCurrentRole:r=>{role=identities[r]?r:'patient';return {...identities[role]}},resetToDefaults:()=>({currentUser:{...identities[role]}}),saveStore:()=>{}};
  window.mindcareState={journals:[],getJournals:()=>[],searchJournals:()=>[],addJournal:()=>null,deleteJournal:()=>{},getMoodLogs:()=>[],addMoodLog:()=>null,getGoals:()=>[],addGoal:()=>null,toggleMilestone:()=>{},getBadges:()=>[],getNotifications:()=>[],getUnreadCount:()=>0,markNotificationRead:()=>{},markAllNotificationsRead:()=>{}};
})();
