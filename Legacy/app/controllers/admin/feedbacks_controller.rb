class Admin::FeedbacksController < Admin::BaseController
  before_action :set_feedback, only: [:show, :edit, :update, :destroy]

  # GET /admin/feedbacks
  def index
    @feedbacks = Feedback.all
  end

  # GET /admin/feedbacks/1
  def show
  end

  # GET /admin/feedbacks/1/edit
  def edit
  end

  # PATCH/PUT /admin/feedbacks/1
  def update
    if @feedback.update(feedback_params)
      redirect_to [:admin, @feedback], notice: 'Feedback was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /admin/feedbacks/1
  def destroy
    @feedback.destroy
    redirect_to admin_feedbacks_url, notice: 'Feedback was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_feedback
      @feedback = Feedback.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def feedback_params
      params.require(:feedback).permit(:user_id, :content)
    end
end
