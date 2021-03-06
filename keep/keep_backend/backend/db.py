from bson import ObjectId

from django.conf import settings
from django.contrib.auth.models import User

from pymongo import MongoClient

from organizations.models import Organization
#from pprint import pprint

connection = MongoClient( settings.MONGODB_HOST, settings.MONGODB_PORT )
db = connection[ settings.MONGODB_DBNAME ]

class DataSerializer( object ):

    def dehydrate( self, data, repository, linked=None ):
        demo_flag=0
        hydrated = []
        fields = repository.fields()
       
        for row in data:
            #print "row....", row
            copy = dict( row )

            # Hydrate the base data keys.
            # 1. Remove the "repo" key if it exists.
            # 2. Rename the "_id" key into the more common "id" key.
            # 3. Convert the python timestamp into a JSON friendly one.
            repo = copy.pop( 'repo' )
            copy[ 'id' ] = str(copy.pop( '_id' ))
            copy[ 'timestamp' ] = copy[ 'timestamp' ].strftime( '%Y-%m-%dT%X' )

            # Now serialize the data according to the field data.
            copy[ 'data' ] = self.serialize_data( data=copy[ 'data' ],
                                                  fields=fields,
                                                  repo_id=repo,
                                                  data_id=copy[ 'id' ] )
            tracker_id = 'data.' + repository.study.tracker
            #print "1. tracker_id is: ", tracker_id #PM
            #print "just before tracker "
            if repository.is_tracker and repository.study and linked:
                link_dict = {}
		    #print "tracker_id is: ", tracker_id #PM
                tracker_id = 'data.' + repository.study.tracker
                tracker_id= 'data.' + 'id' #PM
                data_id = dict(row)['data'].get(repository.study.tracker)               

                # Create list of results
                               
                repo_datas = db.data.find( { tracker_id: data_id } )
                               
                #for repo in repo_datas:
   
                repo_dict = dict( (repo['label'], repo) for repo in repo_datas ) #PM suspicious returns empty
               
                # Check if data is complete or not
                '''            
                for linked_repo in linked:
                                      
                    if linked_repo in repo_dict:
                        print "repo_dict[linked_repo].......... ", repo_dict[linked_repo]

                        if repo_dict[linked_repo]['is_finished']:
                            link_dict[ linked_repo.name ] = 'complete'
                        else:
                            link_dict[ linked_repo.name ] = 'incomplete'
                            #link_dict =check_finished(linked_repo) PM
                    else:
                         #link_dict[ linked_repo.name ] = 'empty'
                         
                        link_dict[ linked_repo.name ] = 'empty'
                         #link_dict[ linked_repo.name ] = 'finished' #PM testing
                ''' 
                print "data id: ", data_id
                copy['linked'] = link_dict
                #check completion status, append result for display
                '''
                count=db.data.find( {'$and':[ { 'data.weight':{ '$ne':''}, 
                                                  'data.func_transplant':{ '$ne':''} ,
                                                  'data.chronic_dial':{ '$ne':''},
                                                  'data.incarcerated':{ '$ne':''},
                                                  'data.height':{ '$ne':''},
                                                  'data.screening_day':{ '$ne':''},
                                                  #'data.country':{ '$ne':''},
                                                  'data.id':data_id,
                                                  'label':'initialclinicaldata' 
                                                  } ]} ).count() 
                                                                                           
               if (count)==1:  
                     copy['linked']['initialclinicaldata']='complete'     
                  else:
                    copy['linked']['initialclinicaldata']='incomplete' 
           
                if db.data.find( {'$and':[ { 'label':'initialclinicaldata' ,
                                            'data.id':data_id
                                           } ]} ).count() ==0:
                   copy['linked']['initialclinicaldata']='empty'                                                                                               
                 '''  
                
                  
                #1 INTIALPATIENTDATA                    
                                                 
                count = db.data.find( {'$and':[ { 'height':{ '$ne':''}, 
                                                  'weight':{ '$ne':''} ,
                                                  'patient_location':{ '$ne':''},
                                                  'comorbidities':{ '$ne':''},
                                                  'history_ckd':{ '$ne':''}, 
                                                  'baseline_scr':{ '$ne':''} ,
                                                  'ss_dehydration':{ '$ne':''},
                                                  'ss_urinary':{ '$ne':''},
                                                  'ss_infectious':{ '$ne':''} ,
                                                  'ss_hypotension':{ '$ne':''},
                                                  'ss_pain':{ '$ne':''},
                                                  'ss_swelling':{ '$ne':''}, 
                                                  'ss_trauma':{ '$ne':''} ,
                                                  'ss_allergic':{ '$ne':''},
                                                  'ss_poisoning':{ '$ne':''},
                                                  'ss_animal':{ '$ne':''}, 
                                                  'ss_pregnancy':{ '$ne':''} ,
                                                  'ss_additional':{ '$ne':''},
                                                  'risk_assessment_points':{ '$ne':''},
                                                  'excl_chronic_dial':{ '$ne':''} ,
                                                  'excl_func_transplant':{ '$ne':''},
                                                   } ]} ).count()   
                                                         
                              
                if (count)>22:  
                    copy['linked']['initialclinicaldata']='complete'     
                else:
                    copy['linked']['initialclinicaldata']='incomplete' 
               
                
                if db.data.find( {'$and':[ { 'label':'initialclinicaldata' ,
                                             'data.id':data_id
                                            } ]} ).count() ==0:
                    copy['linked']['initialclinicaldata']='empty'
                
                #1 INTIALCLINICALDATA                     
                '''count = db.data.find( {'$and':[ { 'data.temperature':{ '$ne':''}, 
                                                  'data.first_assessed_scr':{ '$ne':''} ,
                                                  'data.specific_gravity':{ '$ne':''},
                                                  'data.ph':{ '$ne':''},
                                                  'data.id':data_id,
                                                  'label':'initialclincaldata' 
                                                 } ]} ).count()  ''' 
                                                 
                count = db.data.find( {'$and':[ { 'patient_location':{ '$ne':''}, 
                                                  'talk':{ '$ne':''} ,
                                                  'neuro_deficit':{ '$ne':''},
                                                  'temperature':{ '$ne':''},
                                                  'systolic_bp':{ '$ne':''}, 
                                                  'diastolic_bp':{ '$ne':''} ,
                                                  'respiratory_rate':{ '$ne':''},
                                                  'heart_rate':{ '$ne':''},
                                                  'hydration_lungs':{ '$ne':''} ,
                                                  'hydration_skin':{ '$ne':''},
                                                  'hydration_cap':{ '$ne':''},
                                                  'swelling':{ '$ne':''}, 
                                                  'scr_assessment':{ '$ne':''} ,
                                                  'hgb_assessment':{ '$ne':''},
                                                  'urine_output':{ '$ne':''},
                                                  'pre_aki_io_24hr':{ '$ne':''}, 
                                                  'urine_color':{ '$ne':''} ,
                                                  'urinalysis_done':{ '$ne':''},
                                                  'infection_presence':{ '$ne':''},
                                                  'fluid_therapy':{ '$ne':''} ,
                                                  'diuretics':{ '$ne':''},
                                                  'vasopressors':{ '$ne':''},
                                                  'antibiotics':{ '$ne':''}, 
                                                  'urinary':{ '$ne':''} ,
                                                  'restriction':{ '$ne':''},
                                                  'other_therapy':{ '$ne':''},
                                                  'route_nutrition':{ '$ne':''}, 
                                                  'dialysis_indication':{ '$ne':''} ,
                                                  'dialyzed_so_far':{ '$ne':''},
                                                  'teleconsultation':{ '$ne':''},
                                                  'seen_by_physician':{ '$ne':''} ,
                                                  'followup_scheduled':{ '$ne':''},
                                                  'data.id':data_id,
                                                  'label':'initial_clincal_data' 
                                                 } ]} ).count()   
                                                         
                              
                if (count)>29:  
                    copy['linked']['initialclinicaldata']='complete'     
                else:
                    copy['linked']['initialclinicaldata']='incomplete' 
               
                
                if db.data.find( {'$and':[ { 'label':'initialclinicaldata' ,
                                             'data.id':data_id
                                            } ]} ).count() ==0:
                    copy['linked']['initialclinicaldata']='empty'
                    
           
                #2 DAILYCLINICALLABDATA
                    ''' count = db.data.find( {'$and':[ { 'data.ph':{ '$ne':''}, 
                                                  'data.specific_gravity':{ '$ne':''} ,
                                                  'data.bun_val':{ '$ne':''},
                                                  'data.scr_value':{ '$ne':''},
                                                  'hct':{ '$ne':''},
                                                  'temperature':{ '$ne':''},
                                                  'data.id':data_id,
                                                  'label':'dailyclinicallabdata' 
                                                 } ]} ).count()  
                                                 '''
                                                            
                count = db.data.find( {'$and':[ { 'patient_location':{ '$ne':''}, 
                                                  'talk':{ '$ne':''} ,
                                                  'neuro_deficit':{ '$ne':''},
                                                  'temperature':{ '$ne':''},
                                                  'systolic_bp':{ '$ne':''}, 
                                                  'diastolic_bp':{ '$ne':''} ,
                                                  'respiratory_rate':{ '$ne':''},
                                                  'heart_rate':{ '$ne':''},
                                                  'hydration_lungs':{ '$ne':''} ,
                                                  'hydration_skin':{ '$ne':''},
                                                  'hydration_cap':{ '$ne':''},
                                                  'swelling':{ '$ne':''}, 
                                                  'scr_assessment':{ '$ne':''} ,
                                                  'hgb_assessment':{ '$ne':''},
                                                  'urine_output':{ '$ne':''},
                                                  'pre_aki_io_24hr':{ '$ne':''}, 
                                                  'urine_color':{ '$ne':''} ,
                                                  'urinalysis_done':{ '$ne':''},
                                                  'infection_presence':{ '$ne':''},
                                                  'fluid_therapy':{ '$ne':''} ,
                                                  'diuretics':{ '$ne':''},
                                                  'vasopressors':{ '$ne':''},
                                                  'antibiotics':{ '$ne':''}, 
                                                  'urinary':{ '$ne':''} ,
                                                  'restriction':{ '$ne':''},
                                                  'other_therapy':{ '$ne':''},
                                                  'route_nutrition':{ '$ne':''}, 
                                                  'dialysis_indication':{ '$ne':''} ,
                                                  'dialyzed_so_far':{ '$ne':''},
                                                  'data.id':data_id,
                                                  'label':'daily_clincal_data' 
                                                 } ]} ).count()  
                               
                if (count)>27:  
                    copy['linked']['dailyclinicallabdata']='complete'     
                else:
                    copy['linked']['dailyclinicallabdata']='incomplete'             
                
               
                if db.data.find( {'$and':[ { 'label':'dailyclinicallabdata' , 'data.id':data_id } ]} ).count() ==0:
                    copy['linked']['dailyclinicallabdata']='empty'                   
           
           
                #3 TELECONSULTATION
                '''count = db.data.find( {'$and':[ { 'data.most_important':{ '$ne':''}, 
                                                  'data.id':data_id,
                                                  'label':'teleconsultation' 
                                                 } ]} ).count()  '''
                count = db.data.find( {'$and':[ { 'etio_dehydration':{ '$ne':''}, 
                                                  'develop_loc':{ '$ne':''} ,
                                                  'fluid_therapy':{ '$ne':''},
                                                  'route_nutrition':{ '$ne':''},
                                                  'dialysis_indication':{ '$ne':''}, 
                                                  'disposition_teleconsultation':{ '$ne':''} ,
                                                  'days_to_return':{ '$ne':''},
                                                  } ]} ).count()  
          
                               
                if (count)==6:  
                    copy['linked']['teleconsultation']='complete'     
                else:
                    copy['linked']['teleconsultation']='incomplete' 
               
                
                if db.data.find( {'$and':[ { 'label':'teleconsultation' ,
                                             'data.id':data_id
                                            } ]} ).count() ==0:
                    copy['linked']['teleconsultation']='empty'
                    
                
                #4 DISCHARGEOUTCOME
                '''count = db.data.find( {'$and':[ { 'scr_val':{ '$ne':''}, 
                                                  'data.id':data_id,
                                                  'label':'dischargeoutcome_pm' 
                                                 } ]} ).count()'''
                         
                count = db.data.find( {'$and':[ { 'patient_location':{ '$ne':''}, 
                                                  'ip_interventions':{ '$ne':''} ,
                                                  'why_no_dialysis':{ '$ne':''},
                                                  'rrt_modality':{ '$ne':''},
                                                  'rrt_complications':{ '$ne':''}, 
                                                  'pd_complications':{ '$ne':''} ,
                                                  'currently_on_dialysis':{ '$ne':''},
                                                  'why_stop_dialysis':{ '$ne':''},
                                                  'scr_val':{ '$ne':''} ,
                                                  'biopsy_performed':{ '$ne':''},
                                                  'recovery_status':{ '$ne':''},
                                                  'alive_last':{ '$ne':''}, 
                                                  'alive_discharge':{ '$ne':''} ,
                                                  'cause_of_death':{ '$ne':''},
                                                  'autopsy_performed':{ '$ne':''},
                                                  'nephro_managed':{ '$ne':''}, 
                                                  'hospital_stay':{ '$ne':''} ,
                                                  'location_discharge':{ '$ne':''},
                                                  'disposition':{ '$ne':''},
                                                  'followup_scheduled':{ '$ne':''} ,
                                                  'label':'discharge_outcome' 
                                                 } ]} ).count()        
                               
                if (count)>19:  
                    copy['linked']['dischargeoutcome_pm']='complete'     
                else:
                    copy['linked']['dischargeoutcome_pm']='incomplete' 
               
                
                if db.data.find( {'$and':[ { 'label':'dischargeoutcome_pm' ,
                                             'data.id':data_id
                                            } ]} ).count() ==0:
                    copy['linked']['dischargeoutcome_pm']='empty'
                    
                    
                #5 AFTERDISCHARGEOUTCOME
                '''count = db.data.find( {'$and':[ { #'noneses':{'$exists':'true'},
                                                  'creatinine_unit':{ '$exists':'true'},
                                                  'data.id':data_id,
                                                  'label':'afterdischargeoutcome' 
                                                 } ] } ).count() 
                '''
                                                 
                '''count=count= db.data.find({'data.creatinine_val':{'$exists':'true'}, #list values that should be in array
                                           'data.after_discharge_assessment':{'$exists':'true'},
                                           'data.alive_assessment':{'$exists':'true'},
                                           'data.patient_location':{'$exists':'true'},
                                           'data.currently_dialytic':{'$exists':'true'},
                                           'data.recovery_status':{'$exists':'true'},
                                           'data.creatinine_done':{'$exists':'true'},
                                           'data.followup_scheduled':{'$exists':'true'},
                                           'data.cause_of_death':{'$exists':'true'},
                                           'data.autopsy_performed':{'$exists':'true'},
                                           'data.id':data_id,
                                           'label':'afterdischargeoutcome' 
                                                 }  ).count() '''
                   
                count = db.data.find( {'$and':[ { 'after_discharge_assessment':{ '$ne':''}, 
                                                  'alive_assessment':{ '$ne':''} ,
                                                  'patient_location':{ '$ne':''},
                                                  'currently_dialytic':{ '$ne':''},
                                                  'recovery_status':{ '$ne':''}, 
                                                  'creatinine_done':{ '$ne':''} ,
                                                  'followup_scheduled':{ '$ne':''},
                                                  'cause_of_death':{ '$ne':''},
                                                  'days_after_discharge':{ '$ne':''} ,
                                                  'autopsy_performed':{ '$ne':''},
                                                  'label':'after_discharge_outcome' 
                                                 } ]} ).count()
                
                if (count)>10:  
                    copy['linked']['afterdischargeoutcome']='complete'     
                else:
                    copy['linked']['afterdischargeoutcome']='incomplete' 
               
                
                if db.data.find( {'$and':[ { 'label':'afterdischargeoutcome' ,
                                             'data.id':data_id
                                            } ]} ).count() ==0:
                    copy['linked']['afterdischargeoutcome']='empty'

            hydrated.append( copy )
        return hydrated
    
    def check_finished(self, linked_repo):
        
        tracker_id= 'data.' + 'id' #PM
        data_id = dict(row)['data'].get('id')
        
        #result = db.data.find( { tracker_id: data_id } ) #
        
        result =db.data.find({'data.age':null, 'data.age':1})
            
        return result
        

    def serialize_data( self, data, fields, repo_id, data_id ):
        copy = {}

        for field in fields:

            key = field.get( 'name' )
            val = data.get( key )

            # Convert strings into a unicode representation.
            if field.get( 'type' ) in [ 'text', 'note' ]:
                val = unicode( val ).encode( 'utf-8' )
                copy[ key ] = val

            # Give a full URL for media
            elif field.get( 'type' ) in [ 'photo' ]:

                if settings.DEBUG or settings.TESTING:
                    host = 'localhost:8000/media'
                else:
                    host = settings.AWS_S3_MEDIA_DOMAIN

                val = 'http://%s/%s/%s/%s' % ( host, repo_id, data_id, val )
                copy[ key ] = val

            # Correctly recurse through groups
            elif field.get( 'type' ) == 'group':

                val = self.serialize_data( data=data,
                                            fields=field.get( 'children' ),
                                            repo_id=repo_id,
                                            data_id=data_id )
                for k in val:
                    copy[ k ] = val[ k ]

            else:
                copy[ key ] = val

        return copy

def dehydrate( survey ):

    # Reformat python DateTime into JS DateTime
    if 'timestamp' in survey:
        survey[ 'timestamp' ] = survey[ 'timestamp' ].strftime( '%Y-%m-%dT%X' )

    if '_id' in survey:
        survey[ 'id' ] = survey.pop( '_id' )

    for key in survey.keys():
        if isinstance( survey[key], dict ):
            survey[ key ] = dehydrate( survey[key] )
        elif isinstance( survey[key], list ):
            survey[ key ] = dehydrate_list( survey[key] )
        else:
            survey[ key ] = unicode( survey[ key ] ).encode( 'utf-8' )

    return survey


def dehydrate_list( target ):

    hydrated = []
    for el in target:
        if isinstance( el, dict ):
            hydrated.append( dehydrate( el ) )
        elif isinstance( el, list ):
            hydrated.append( dehydrate_list( el ) )
        else:
            hydrated.append( unicode( el ).encode( 'utf-8' ) )

    return hydrated


def dehydrate_survey( cursor ):
    '''
        Decrypt survey data and turn any timestamps into javascript-readable
        values.
    '''
    if isinstance( cursor, dict ):
        return dehydrate( cursor )

    return [ dehydrate( row ) for row in cursor ]


def user_or_organization( name ):
    results = User.objects.filter( username=name )

    if len( results ) > 0:
        return results[0]

    results = Organization.objects.filter( name=name )

    if len( results ) > 0:
        return results[0]

    return None
