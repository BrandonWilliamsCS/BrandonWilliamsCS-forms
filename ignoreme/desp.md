So what's all the fuss about forms?

I think it's MOSTLY just UX. Accessibility requires names and junk. Validation has special rules to it. But otherwise there's no reason to be so formal about the model.


Individual fields that are ultimately based around DOM form elements can be modelled so as to simplify all of that without dragging the whole world with them.

base field things:
-accept name/id prefix
-accept disabled AND readonly
-initial value

Okay, so what does a well-behaved form field thing do that goes above and beyond pure field behavior?
-packages validity together with each value
--consumes
-displays error message at appropriate time
--requires separate error message getter
-observes confirmations
-reports value as undefined whenever disabled
-applies name/id prefix as needed

so the practical differences:
-new props
--validator
--formValue (instead of value)
--error message getter
--confirmations
-hook calls
--possibly get error message getter or other ambient stuff directly
--put it all together to transform props


***The takeaway here is to NOT impose a model onto this. A form control just takes a slightly more aware set of props and transforms them with a hook.
So then the real thing is to simplify typical use cases. Make it easy to say "associate this part of the value stuff with this form control".
!!! careful not to let this centralize form values. What is "the" value?
-don't re-render the whole form when one field changes
--useSubscribableValue as close to where it's needed as possible
--if it's not rendered, keep it in "model" form
-SOMETHING needs to subscribe to a FormValue stream and give it to the form field.
--which means that something is keeping that in state.
--this cannot be delegated to the parent in general, or else it's centralized.
--so, either the form field OR one addl. level up does so
---don't want yet a third component for every type

MOST of the time, there's a single form/group with a handful of hard-coded form controls.
?? What needs to come from the "context"? What can be packaged together from a "model"?

This is where we step from field level to the abstract "control" level.
-make NO assumptions that there are ANY DOM fields
--drop expectation for name, label, id





???? who reports initial value, and when?
this depends on the format. Simple groups will have the group component take an initial value prop and either initializes it at the group level OR delegates to children
-what if both are attempted? Child has to set value through callback AFTER creation, so it's naturally second.
??!? disable field whenever associated model is disabled
???? should a form control distinguish valid and invalid value types?
 !!! consider putting errorMessageGetter in context ONLY
!!?? difficulty in "hard-coded" vs variable collection stuff
If the end field(s) must emit their initial value, the must be rendered to do so.
But then we have to disconnect what is rendered from the model value.
Fields must be given their initial value, but don't care where they come from...





So here's the real crux... who takes raw value changes and emits FormValues (or `undefined`)?
-for one, this must be ABOVE any field or even form field. Its job is UX and particularly DOM interface.
-the "hard-coded" vs "variable" dichotomy comes into play.
--a hard-coded group could have its value specified up top but realistically should trickle it down the hierarchy through props.
Overall the answer is "it's part of the pipeline". Different sources feed in and consume from their entry point, and those values get bounced around a graph.


When composing this FromGroup splitter thing, where is data stored/owned?
Well the group is given arbitrary props that represents part of the storage/ownership but then has its own data to contribute to a new, self-owned transformed set of data.
Will need to useStableValue the model so we avoid subscription churn on re-render.


?? a pain point that will come up is that there are so many useStableValue calls needed.
